export interface Week {
    id: number;
    week_number: number;
    start_date: string;
    end_date: string;
  }
  
  export interface Solution {
    id: number;
    team_id: number;
    week: Week;
    status: "ACTIVE" | "PAST" | "DRAFT";
    created_at: string;
  }
  
  export interface AssignmentUser {
    id: number;
    first_name: string;
    last_name: string;
  }
  
  export interface AssignmentShift {
    id: number;
    name: string;
    time_start: string;
    time_end: string;
    task: string;
  }
  
  export interface AssignmentDay {
    id: number;
    name: string;
  }
  
  export interface SolutionAssignment {
    assignment_id: number;
    locked: boolean;
    user: AssignmentUser | null;
    shift: AssignmentShift | null;
    day: AssignmentDay | null;
  }
  
  
  
//   export interface SingleAssignmentResponse extends SolutionAssignment {}
  