import React, { useState, useEffect } from "react";
import CalendarComponent from "./components/calendarComp";
import { fetchShifts } from "./services/ShiftService"; 
import { ShiftResponse } from "@/types/shift"; 
import {CalendarEvent} from "@/types/callender";

const CalendarsPage: React.FC = () => {
  const [viewEvents, setViewEvents] = useState<CalendarEvent[]>([]);
  const [refreshCalendar, setRefreshCalendar] = useState(false); 

  const getDayOfWeek = (date: Date, dayName: string): Date | null => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = daysOfWeek.indexOf(dayName);

    if (dayIndex === -1) return null;

    const diff = dayIndex - date.getDay();

    // Adjust if the diff is negative and it’s Sunday, to move to the next Sunday
    if (diff < 0 && dayIndex === 0) {
      return new Date(date.setDate(date.getDate() + (7 + diff)));
    }

    const result = new Date(date);
    result.setDate(date.getDate() + diff);
    return result;
  };

  useEffect(() => {
    const loadShifts = async () => {
      const fetchedShifts: ShiftResponse[] = await fetchShifts();
      const mappedEvents: CalendarEvent[] = [];
      const today = new Date();

  
      fetchedShifts.forEach((shift) => {
        shift.days.forEach((day) => {
          // Get the first occurrence of the shift day (e.g., "Monday", "Tuesday")
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
                id: shift.id, 
                start: startDate,
                end: firstPartEnd,
                title: shift.name
              });
  
              const secondPartStart = new Date(shiftDate);
              secondPartStart.setDate(secondPartStart.getDate() + 1);
              secondPartStart.setHours(0, 0, 0);
  
              const secondPartEnd = new Date(secondPartStart);
              secondPartEnd.setHours(endHour, endMinute, 0);
  
              mappedEvents.push({
                id: shift.id, 
                start: secondPartStart,
                end: secondPartEnd,
                title: shift.name
              });
            } else {
              // Normal shift
              mappedEvents.push({
                id: shift.id, 
                start: startDate,
                end: endDate,
                title: shift.name
              });
            }

            // Add shifts for the next 5 weeks (i.e., repeat the shift every week)
            for (let i = 1; i < 5; i++) {
              const repeatedStartDate = new Date(startDate);
              repeatedStartDate.setDate(repeatedStartDate.getDate() + i * 7); // Add 7 days for each repetition
  
              const repeatedEndDate = new Date(endDate);
              repeatedEndDate.setDate(repeatedEndDate.getDate() + i * 7); // Add 7 days for each repetition
  
              mappedEvents.push({
                id: shift.id, 
                start: repeatedStartDate,
                end: repeatedEndDate,
                title: shift.name
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
