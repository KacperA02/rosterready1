import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, getDay, startOfWeek, parse, isWithinInterval } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventComponent from "./eventComponent";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import {
	createSchedule,
	fetchWeekByStartDate,
} from "../services/AssignmentService";
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
	getDay,
	locales,
});

interface CalendarEvent {
	id: number;
	title: string;
	start: Date;
	end: Date;
	no_of_users: number;
	locked?: boolean;
	trueEnd?: Date;
	isGenerated?: boolean;
}

interface CalendarProps {
	events: CalendarEvent[];
	selectable: boolean;
	setRefreshCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

const CalendarComponent: React.FC<CalendarProps> = ({
	events,
	setRefreshCalendar,
}) => {
	const [currentView, setCurrentView] = useState<View>("month");
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [showRandomButton, setShowRandomButton] = useState(false);
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	// Check if all events in the current week's range have isGenerated: false
	const checkIfAllEventsAreGeneratedFalse = (
		weekStart: Date,
		weekEnd: Date
	) => {
		// Filter the events that fall within the week range
		const eventsInWeek = events.filter(
			(event) =>
				isWithinInterval(event.start, { start: weekStart, end: weekEnd }) ||
				isWithinInterval(event.end, { start: weekStart, end: weekEnd })
		);

		// Check if all the events within this week have isGenerated: false
		const allGeneratedFalse = eventsInWeek.every((event) => !event.isGenerated);
		setShowRandomButton(allGeneratedFalse);
	};

	useEffect(() => {
		if (currentView === "week") {
			const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
			const endOfWeekDate = new Date(startOfWeekDate);
			endOfWeekDate.setDate(startOfWeekDate.getDate() + 6);

			checkIfAllEventsAreGeneratedFalse(startOfWeekDate, endOfWeekDate);
		}
	}, [currentDate, currentView, events]);

	const handleGenerateSchedule = async () => {
		setLoading(true);
		setProgress(0);

		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					clearInterval(progressInterval);
				}
				return prev + 10;
			});
		}, 500);

		const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 2 });
		const formattedDate = startOfWeekDate.toISOString().split("T")[0];

		try {
			const weekData = await fetchWeekByStartDate(formattedDate);
			if (!weekData?.id) {
				console.error("Week not found for date:", formattedDate);
				setLoading(false);
				return;
			}

			const teamId = user?.team_id;
			if (!teamId) {
				console.error("No team ID found in auth context.");
				setLoading(false);
				return;
			}

			const success = await createSchedule(teamId, weekData.id);

			if (success) {
				setRefreshCalendar(true);
				setTimeout(() => {
					setRefreshCalendar(false);
					setLoading(false);
					setProgress(0);
				}, 2000);
			} else {
				alert("Failed to create schedule.");
			}
		} catch (err) {
			console.error("Error during schedule generation:", err);
		} finally {
			setLoading(false);
			setProgress(0);
		}
	};

	return (
		<div className="bg-gray-100 pb-20 mt-5 pt-5 rounded-lg shadow-md">
			<div style={{ height: 600 }}>
				{showRandomButton && (
					<div className="space-y-4">
						<Button
							variant={"secondary"}
							onClick={handleGenerateSchedule}
							disabled={loading}
						>
							{loading ? "Generating..." : "Generate Schedule"}
						</Button>
						{loading && <Progress value={progress} className="h-2" />}
					</div>
				)}
				{loading && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
						<div className="w-1/3 bg-white p-6 rounded-lg shadow-lg">
							<p className="text-center mb-4 font-medium text-gray-800">
								Generating Schedule...
							</p>
							<Progress value={progress} className="h-3 bg-green-200">
								<div
									className="bg-green-500 h-full transition-all duration-300 ease-in-out"
									style={{ width: `${progress}%` }}
								/>
							</Progress>
						</div>
					</div>
				)}

				<Calendar
					localizer={localizer}
					events={events}
					startAccessor="start"
					endAccessor="end"
					selectable="ignoreEvents"
					style={{ backgroundColor: "white" }}
					view={currentView}
					onView={setCurrentView}
					date={currentDate}
					onNavigate={setCurrentDate}
					components={{
						event: (props) => <EventComponent {...props} view={currentView} />,
					}}
				/>
			</div>
		</div>
	);
};

export default CalendarComponent;
