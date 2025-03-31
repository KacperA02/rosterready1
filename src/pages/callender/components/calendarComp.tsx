import { useState } from "react";
import { Calendar, dateFnsLocalizer, SlotInfo, View } from "react-big-calendar";
import { format, getDay, startOfWeek, parse } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EditShift from "@/pages/shifts/Edit";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import CreateShift from "@/pages/shifts/Create";
import { attachDaysToShift } from "@/pages/callender/services/ShiftService";
import { ShiftDaysCreate } from "@/types/shift";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
}

interface CalendarProps {
	events: CalendarEvent[];
	selectable: boolean;
	setRefreshCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}

const dayToInt = {
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
	Sunday: 7,
};

const attachShiftToDay = async (shiftId: number, dayId: number) => {
	console.log(`Attaching shift ${shiftId} to day ${dayId}`);

	const shiftDays: ShiftDaysCreate = {
		day_ids: [dayId],
	};

	try {
		// Call the service to attach the days to the shift
		const response = await attachDaysToShift(shiftId, shiftDays);
		console.log("Days attached to shift successfully:", response);
	} catch (error) {
		console.error("Error attaching days to shift:", error);
	}
};

const CalendarComponent: React.FC<CalendarProps> = ({
	events,
	setRefreshCalendar,
}) => {
	const [selectedDay, setSelectedDay] = useState<Date | null>(null);
	const [openSheet, setOpenSheet] = useState<boolean>(false);
	const [currentView, setCurrentView] = useState<View>("month");
	const [currentDate, setCurrentDate] = useState<Date>(new Date());
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null
	);
	const [selectedShiftId, setSelectedShiftId] = useState<number | null>(
		null
	);
	const [openEditSheet, setOpenEditSheet] = useState(false);
	const [popoverOpen, setPopoverOpen] = useState(false);

	const handleSelectSlot = (slotInfo: SlotInfo) => {
		setSelectedDay(slotInfo.start);
		setOpenSheet(true);
	};

	const handleShiftCreated = async (shiftId: number) => {
		if (shiftId && selectedDay) {
			const dayOfWeek = format(selectedDay, "eeee"); // Get the full weekday name (e.g., "Monday")
			const dayInt = dayToInt[dayOfWeek as keyof typeof dayToInt]; // Map to integer (e.g., Monday -> 1)

			if (dayInt !== undefined) {
				// Attach the selected day to the shift
				await attachShiftToDay(shiftId, dayInt);
				setRefreshCalendar((prev) => !prev);
			}
		}
		setOpenSheet(false);
	};

	const handleEventClick = (
		event: CalendarEvent,
		e: React.SyntheticEvent<HTMLElement, Event>
	) => {
		e.preventDefault();
		setSelectedEvent(event);
		setPopoverOpen(true);
	};

	const handleEditClick = () => {
		if (selectedEvent?.id) {
			setSelectedShiftId(selectedEvent.id); // Store only the shift ID
			setOpenEditSheet(true);
		}
		setPopoverOpen(false);
	};

	const handleDeleteClick = () => {
		if (selectedEvent) {
			console.log("Deleting event:", selectedEvent);
			
		}
		setPopoverOpen(false);
	};

	return (
		<div style={{ height: 600 }}>
			<Calendar
				localizer={localizer}
				events={events}
				startAccessor="start"
				endAccessor="end"
				selectable="ignoreEvents"
				onSelectSlot={handleSelectSlot}
				onSelectEvent={handleEventClick}
				style={{ backgroundColor: "white" }}
				view={currentView}
				onView={setCurrentView}
				date={currentDate}
				onNavigate={setCurrentDate}
			/>
			{popoverOpen && selectedEvent && (
				<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
					<PopoverTrigger>
						<h3>Close PopUp</h3>
					</PopoverTrigger>
					<PopoverContent>
						<div style={{ padding: "10px" }}>
							<h3>
								{selectedEvent
									? `Edit or Delete: ${selectedEvent.title}`
									: "Please select an event to edit or delete."}
							</h3>
							<Button variant="secondary"  onClick={handleEditClick}>
								Edit
							</Button>
							<Button variant="destructive" onClick={handleDeleteClick}>Delete</Button>
						</div>
					</PopoverContent>
				</Popover>
			)}
			<Sheet open={openSheet} onOpenChange={setOpenSheet}>
				<SheetContent side="bottom">
					<SheetHeader>
						<SheetTitle>
							Create a New Shift for{" "}
							{selectedDay ? format(selectedDay, "eeee") : ""}
						</SheetTitle>
					</SheetHeader>
					<CreateShift
						selectedDate={selectedDay}
						onShiftCreated={handleShiftCreated}
						onClose={() => setOpenSheet(false)}
					/>
				</SheetContent>
			</Sheet>
			<Sheet open={openEditSheet} onOpenChange={setOpenEditSheet}>
	<SheetContent side="bottom">
		<SheetHeader>
			<SheetTitle>Edit Shift</SheetTitle>
		</SheetHeader>
		{selectedShiftId && (
			<EditShift
				shiftId={selectedShiftId} // Pass only shiftId
				onShiftUpdated={async () => {
					setRefreshCalendar((prev) => !prev);
					return Promise.resolve();
				}}
				onClose={() => setOpenEditSheet(false)}
			/>
		)}
	</SheetContent>
</Sheet>;
		</div>
	);
};

export default CalendarComponent;
