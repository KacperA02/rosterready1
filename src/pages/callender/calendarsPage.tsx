import React, { useState, useEffect } from "react";
import CalendarComponent from "./components/calendarComp";
import { fetchShifts } from "./services/ShiftService"; 
import { ShiftResponse, ShiftEvent} from "@/types/shift"; 


const CalendarsPage: React.FC = () => {
  const [viewEvents, setViewEvents] = useState<ShiftEvent[]>([]);
  const [refreshCalendar, setRefreshCalendar] = useState(false); 

  const getDayOfWeek = (date: Date, dayId: number): Date | null => {
    // Converted 1-7 to 0-6 (1 = Monday, 7 = Sunday)
    const targetDayIndex = (dayId % 7); 
    const diff = targetDayIndex - date.getDay();
    
    const result = new Date(date);
    result.setDate(date.getDate() + (diff >= 0 ? diff : diff + 7)); // Ensure positive diff
    return result;
  };

  useEffect(() => {
    const loadShifts = async () => {
      const fetchedShifts: ShiftResponse[] = await fetchShifts();
      const mappedEvents: ShiftEvent[] = [];
      const today = new Date();
      const twoMonthsLater = new Date();
      twoMonthsLater.setMonth(today.getMonth() + 12); // Get the date two months from today

      fetchedShifts.forEach((shift) => {
        shift.days.forEach((day) => {

          const shiftDayId = day.id; 
          let currentDate = getDayOfWeek(today, shiftDayId); 
          if (!currentDate) return;

          while (currentDate <= twoMonthsLater) {
            const [startHour, startMinute] = shift.time_start.split(":").map(Number);
            const [endHour, endMinute] = shift.time_end.split(":").map(Number);
            
            const startDate = new Date(currentDate);
            startDate.setHours(startHour, startMinute, 0);

            const endDate = new Date(currentDate);
            endDate.setHours(endHour, endMinute, 0);

            if (endHour < startHour) {
              // Night shift (spanning to the next day)
              const firstPartEnd = new Date(startDate);
              firstPartEnd.setHours(23, 59, 59);
              
              mappedEvents.push({
                id: shift.id,
                start: startDate,
                end: firstPartEnd,
                title: shift.name
              });
              const secondPartStart = new Date(currentDate);
              secondPartStart.setDate(secondPartStart.getDate() + 1); // Move to next day
              secondPartStart.setHours(0, 0, 0);

              const secondPartEnd = new Date(secondPartStart);
              secondPartEnd.setHours(endHour, endMinute, 0);

              mappedEvents.push({
                id: shift.id, 
                start: secondPartStart,
                end: secondPartEnd,
                title: shift.name,
              });
            } else {
              // Normal shift
              // Check if the shift ends on the same day
              mappedEvents.push({
                id: shift.id,
                start: startDate,
                end: endDate,
                title: shift.name,
              });
            }

            // Move to the same day in the next week
            currentDate.setDate(currentDate.getDate() + 7);
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
