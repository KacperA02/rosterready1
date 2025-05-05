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
	acceptSolution,
	regenerateSolution,
	declineSolution,
} from "../services/AssignmentService";
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }),
	getDay,
	locales,
});
import { useRoles } from "@/hooks/useRoles";
interface CalendarEvent {
	id: number;
	title: string;
	start: Date;
	end: Date;
	no_of_users: number;
	assignment_id?: number;
	locked?: boolean;
	trueEnd?: Date;
	isGenerated?: boolean;
	solution_id?: number;
	status?: string;
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
	const [currentWeekSolutionId, setCurrentWeekSolutionId] = useState<
		number | null
	>(null);
	const [currentWeekStatus, setCurrentWeekStatus] = useState<string | null>(
		null
	);
	const [actionLoading, setActionLoading] = useState(false);
	const { isEmployer } = useRoles();

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
			const solutionEvent = events.find(
				(event) =>
					event.isGenerated &&
					isWithinInterval(event.start, {
						start: startOfWeekDate,
						end: endOfWeekDate,
					}) &&
					event.solution_id !== undefined
			);
			setCurrentWeekStatus(solutionEvent?.status ?? null);
			setCurrentWeekSolutionId(solutionEvent?.solution_id ?? null);
			console.log("Current Week Solution ID:", currentWeekSolutionId);
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

		const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 });
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
	const handleAcceptSolution = async () => {
		if (!currentWeekSolutionId) return;

		setActionLoading(true);
		const success = await acceptSolution(currentWeekSolutionId);
		setActionLoading(false);

		if (success) {
			alert(`Schedule accepted. Notified Employees`);
			setRefreshCalendar(true);
		} else {
			alert("Failed to accept the solution.");
		}
	};

	const handleDeclineSolution = async () => {
		if (!currentWeekSolutionId) return;

		if (!confirm("Are you sure you want to decline this solution?")) return;

		setActionLoading(true);
		const success = await declineSolution(currentWeekSolutionId);
		setActionLoading(false);

		if (success) {
			alert(`Solution declined.`);
			setRefreshCalendar(true);
		} else {
			alert("Failed to decline the solution.");
		}
	};
	const handleRegeneration = async () => {
		if (!currentWeekSolutionId) return;

		setActionLoading(true);
		const success = await regenerateSolution(currentWeekSolutionId);
		setActionLoading(false);

		if (success) {
			alert(`Schedule Regenerated`);
			setRefreshCalendar(true);
			setTimeout(() => {
				setLoading(false);
				setRefreshCalendar(false);
			}, 2000);
		} else {
			alert("Failed to accept the solution.");
		}
	};

	return (
		<div>
		<div className="mt-2">
			{/* Buttons only show if isEmployer is true */}
			{isEmployer() && currentView === "week" && (
					<div className="flex justify-end items-center">
						{showRandomButton && (
							<div className="flex">
								<Button
									variant={"default"}
									onClick={handleGenerateSchedule}
									disabled={loading}
								>
									{loading ? "Generating..." : "Generate Schedule"}
								</Button>
								{loading && <Progress value={progress} className="h-2" />}
							</div>
						)}
						{currentView === "week" &&
							currentWeekSolutionId &&
							currentWeekStatus === "DRAFT" && (
								<div className="flex justify-between items-center w-full">
									{/* Regenerate Button on the Left */}
									<Button
										className="text-black"
										variant="default"
										onClick={handleRegeneration}
										disabled={actionLoading}
									>
										{actionLoading ? "Regenerating..." : "Regenerate"}
									</Button>

									{/* Accept/Decline Buttons on the Right */}
									<div className="flex gap-4">
										<Button
											className="text-black"
											variant="default"
											onClick={handleAcceptSolution}
											disabled={actionLoading}
										>
											{actionLoading ? "Accepting..." : "Accept Solution"}
										</Button>
										<Button
											className="text-black"
											variant="destructive"
											onClick={handleDeclineSolution}
											disabled={actionLoading}
										>
											{actionLoading ? "Declining..." : "Decline Solution"}
										</Button>
									</div>
								</div>
							)}
					</div>
				)}
		</div>
		<div className="pb-20 mb-4 rounded-lg shadow-md pt-4">
			<div style={{ height: 600 }}>
				{/* Loader */}
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

				{/* Calendar always renders */}
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
		</div>
	);
};

export default CalendarComponent;
