// ShiftCreate defines how to create a new shift
export interface ShiftCreate {
   name: string;
   time_start: string;
   time_end: string;
   task?: string;
   no_of_users?: number;
 }
 
 // DayResponse defines a day that can be associated with a shift
 export interface DayResponse {
   id: number;
   name: string;
 }
 
 // ShiftResponse defines a shift that includes an array of associated days
 export interface ShiftResponse {
   id: number;
   name: string;
   time_start: string;
   time_end: string;
   task?: string;
   no_of_users: number;
   team_id: number;
   days: DayResponse[];
 }
 
 export interface ShiftDaysCreate {
   day_ids: number[];
 }


 export interface ShiftEvent {
  id: number;
  start: Date;
  end: Date;
  title: string;
  no_of_users: number;
  trueEnd: Date;
  locked?: boolean;
  isGenerated?: boolean; 
  users?: { first_name: string; last_name: string }[];
  solution_id?: number;
  status?: string;
}
