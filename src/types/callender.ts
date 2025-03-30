export interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
}
  
export interface CalendarProps {
    events: CalendarEvent[];
    selectable: boolean;
    setRefreshCalendar: React.Dispatch<React.SetStateAction<boolean>>;
}