import { useState } from "react";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import { format, getDay, startOfWeek, parse } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventComponent from "./eventComponent"; 

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
}

interface CalendarProps {
	events: CalendarEvent[];
	selectable: boolean;
	setRefreshCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}



const CalendarComponent: React.FC<CalendarProps> = ({
	events,
}) => {
	const [currentView, setCurrentView] = useState<View>("month");
	const [currentDate, setCurrentDate] = useState<Date>(new Date());



	return (
		<div style={{ height: 600 }}>
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
					event: (props) => <EventComponent {...props} view={currentView} />
				  }}
			/>
			
			
		</div>
	);
};

export default CalendarComponent;
