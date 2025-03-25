import React, { useState, useEffect } from "react";
import CalendarComponent from "./components/calendarComp";
import { fetchShifts } from "./services/ShiftService"; 
import { ShiftResponse } from "@/types/shift"; 

interface ShiftEvent {
  start: Date;
  end: Date;
  title: string;
  color:string;
}

const CalendarsPage: React.FC = () => {
  const [viewEvents, setViewEvents] = useState<ShiftEvent[]>([]);
  // State to trigger refresh
  const [refreshCalendar, setRefreshCalendar] = useState(false); 

  // Function to get the date for a specific day name (e.g., "Monday", "Tuesday")
const getDayOfWeek = (date: Date, dayName: string): Date | null => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayIndex = daysOfWeek.indexOf(dayName);

  if (dayIndex === -1) return null;

  const diff = dayIndex - date.getDay();

  // Adjust if the diff is negative and it’s Sunday, to move to the next Sunday
  if (diff < 0 && dayIndex === 0) {
    return new Date(date.setDate(date.getDate() + (7 + diff)));
  }

  // any other day
  const result = new Date(date);
  result.setDate(date.getDate() + diff);
  return result;
};


  // Fetch shifts when the component mounts or when refreshCalendar changes
  useEffect(() => {
    const loadShifts = async () => {
      const fetchedShifts: ShiftResponse[] = await fetchShifts();
      const mappedEvents: ShiftEvent[] = [];
      const today = new Date();
  
      // Function to generate random colors
      const getRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
  
      // Store shift colors (so each shift type has a consistent color)
      const shiftColorMap = new Map<string, string>();
  
      fetchedShifts.forEach((shift) => {
        if (!shiftColorMap.has(shift.name)) {
          shiftColorMap.set(shift.name, getRandomColor()); // Assign a random color
        }
        const shiftColor = shiftColorMap.get(shift.name) || "#9C27B0"; // Fallback color
  
        shift.days.forEach((day) => {
          const shiftDate = getDayOfWeek(today, day.name);
  
          if (shiftDate) {
            const [startHour, startMinute] = shift.time_start.split(":").map(Number);
            const [endHour, endMinute] = shift.time_end.split(":").map(Number);
  
            const startDate = new Date(shiftDate);
            startDate.setHours(startHour, startMinute, 0);
  
            const endDate = new Date(shiftDate);
            endDate.setHours(endHour, endMinute, 0);
  
            if (endHour < startHour) {
              // Night shift (split into two parts)
              const firstPartEnd = new Date(startDate);
              firstPartEnd.setHours(23, 59, 59);
  
              mappedEvents.push({
                start: startDate,
                end: firstPartEnd,
                title: shift.name,
                color: shiftColor,
              });
  
              const secondPartStart = new Date(shiftDate);
              secondPartStart.setDate(secondPartStart.getDate() + 1);
              secondPartStart.setHours(0, 0, 0);
  
              const secondPartEnd = new Date(secondPartStart);
              secondPartEnd.setHours(endHour, endMinute, 0);
  
              mappedEvents.push({
                start: secondPartStart,
                end: secondPartEnd,
                title: shift.name,
                color: shiftColor,
              });
            } else {
              // Normal shift
              mappedEvents.push({
                start: startDate,
                end: endDate,
                title: shift.name,
                color: shiftColor,
              });
            }
          }
        });
      });
  
      setViewEvents(mappedEvents);
    };
  
    loadShifts();
  }, [refreshCalendar]);
  

  return (
    <div>
      <h2>View Calendar</h2>
      <CalendarComponent
        events={viewEvents}
        selectable={false}
        setRefreshCalendar={setRefreshCalendar}
      />
    </div>
  );
};

export default CalendarsPage;
