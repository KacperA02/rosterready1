// Defines the structure of an Expertise
export interface IExpertise {
  id: number;
  name: string;
  team_id:number;
  users: IUser[];   
  shifts: IShift[]; 
}

// Defines a User
export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
}


export interface IShift {
  id: number;
  name: string;      
}

// Structure for Creating a New Expertise
export interface ExpertiseCreate {
  name: string;
}

// Represents a User-Expertise Relationship
export interface UserAttached {
  user_id: number;
  expertise_id: number;
}

// Represents a Shift-Expertise Relationship
export interface ShiftAttached {
  shift_id: number;
  expertise_id: number;
}

// ✅ NEW: Type for Editing Expertise in ExpertiseEditSheet
export interface ExpertiseEdit {
  id: number;
  name: string;
}

// ✅ NEW: Type for Attaching Users in AttachUsersSheet
export interface AttachUsers {
  expertiseId: number;
  users: number[]; // Array of user IDs to attach
}

// ✅ NEW: Type for Attaching Shifts in AttachShiftsSheet
export interface AttachShifts {
  expertiseId: number;
  shifts: number[]; // Array of shift IDs to attach
}
