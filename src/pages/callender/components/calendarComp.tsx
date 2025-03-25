import React, { useState, useEffect } from "react";
// Import Calendar components and utilities from react-big-calendar
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
// Import date functions for formatting and getting date details
import { format, getDay, startOfWeek } from "date-fns";
// Import English US locale for date-fns
import { enUS } from "date-fns/locale/en-US";
// Import CSS styles for react-big-calendar
import "react-big-calendar/lib/css/react-big-calendar.css";
import { attachDaysToShift, fetchShifts } from "../services/ShiftService"; 
import {  Sheet,SheetContent,SheetHeader,SheetTitle,SheetTrigger, } from "@/components/ui/sheet";
import CreateShift from "@/pages/shifts/Create";

// Set up date localization with Monday as the first day of the week
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  // Converting string to date
  parse: (date: string) => new Date(date), 
  // setting monday as first day
  startOfWeek: (date: Date) => startOfWeek(date, { weekStartsOn: 1 }), 
  getDay,
  locales,
});

// Defined a custom ShiftEvent interface that extends the default Event type-> probably should move to types file
interface ShiftEvent extends Event {
  color: string;  
}

// Defined the Shift structure -> probably should move to types file
interface Shift {
  id: number;
  name: string;
  time_start: string;
  time_end: string;
}

// Define props for the CalendarComponent
interface CalendarComponentProps {
  events: ShiftEvent[]; // Events with additional color property
  selectable?: boolean;
  setRefreshCalendar: React.Dispatch<React.SetStateAction<boolean>>; // Function to refresh the calendar
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({
  events,
  selectable,
  setRefreshCalendar, // Function to update calendar state
}) => {
  const [shifts, setShifts] = useState<Shift[]>([]); // Store fetched shifts
  const [selectedDay, setSelectedDay] = useState<Date | null>(null); // Track selected day
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null); // Track selected shift
  const [openSheet, setOpenSheet] = useState(false); // Control modal (sheet) visibility
  
  useEffect(() => {
    // Fetch available shifts when the component loads
    const getShifts = async () => {
      const fetchedShifts = await fetchShifts(); // API call to get shifts
      console.log("Fetched Shifts:", fetchedShifts); // Debugging log
      setShifts(fetchedShifts);
    };
    getShifts();
  }, []);

  // Handle navigation (when user moves between weeks or months in the calendar)
  const handleNavigate = (date: Date) => {
    setSelectedDay(date); // Update selected day
  };

  // Function to add a shift to a selected day
  const handleAddShift = async () => {
    if (selectedShift && selectedDay) {
      try {
        let dayIndex = getDay(selectedDay); 

        // Convert Sunday (0) to 7 since the backend expects Sunday as 7
        if (dayIndex === 0) {
          dayIndex = 7;
        }

        // Create the object with day_ids to attach shift
        const shiftDays = {
          day_ids: [dayIndex],
        };

        console.log("Attaching Shift to Days:", shiftDays); 

        // Call API to attach shift to the selected day
        await attachDaysToShift(selectedShift.id, shiftDays);
        setRefreshCalendar(true); // Trigger calendar refresh
        alert("Shift added successfully!");
        setTimeout(() => {
          setRefreshCalendar(false);
        }, 1000);
      } catch (error) {
        console.error("Error adding shift to day:", error);
      }
    }
  };

  return (
    <div style={{ height: 500 }}>
      {/* Initialize the calendar component */}
      <Calendar
        // Set up localization
        localizer={localizer}
        // Ensure all events have a color, defaulting to blue if not set
        events={events.map(event => ({ ...event, color: event.color || "#007bff" }) as ShiftEvent)} 
        // Define what property represents the start time of an event
        startAccessor="start"
        // Define what property represents the end time of an event
        endAccessor="end"
        // Allow selecting days or time slots if enabled
        selectable={selectable}
        // Set the background color of the calendar
        style={{ backgroundColor: "white" }}
        // Define available calendar views
        views={["month", "week", "day"]} 
        // Set the default view to "week"
        defaultView="week"
        // Prevent overlapping of events
        dayLayoutAlgorithm="no-overlap"
        // Set culture for localization
        culture="en-US"
        // Handle when user navigates between dates
        onNavigate={handleNavigate} 
        // Customize event appearance
        eventPropGetter={(event: ShiftEvent) => ({
          style: {
            // Set event background color
            backgroundColor: event.color, 
            // Set event text color to white
            color: "#fff", 
            // Rounded the edges of the event box
            borderRadius: "4px",
            // Added some padding inside the event box
            padding: "2px",
          },
        })} 
      />

      {selectedDay && (
        <div>
          <h3>Selected Day: {format(selectedDay, "eeee, MMMM dd, yyyy")}</h3>
          {shifts.length > 0 ? (
            <div>
              {/* Dropdown to select a shift */}
              <select onChange={(e) => setSelectedShift(shifts[+e.target.value])}>
                <option value="">Select Shift</option>
                {shifts.map((shift, index) => (
                  <option key={shift.id} value={index}>
                    {shift.name} - {shift.time_start} to {shift.time_end}
                  </option>
                ))}
              </select>
              {/* Button to attach shift to selected day */}
              <button onClick={handleAddShift}>Add Shift to Day</button>
            </div>
          ) : (
            <p>No shifts available</p>    
          )}

          {/* Button to open the modal for creating a new shift */}
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger asChild>
              <button className="bg-blue-500 text-white p-2 rounded-md">Create a Shift</button>
            </SheetTrigger>

            {/* Modal content for creating a new shift */}
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Create a New Shift</SheetTitle>
              </SheetHeader>
              <CreateShift onClose={() => setOpenSheet(false)} />
            </SheetContent>
          </Sheet>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
