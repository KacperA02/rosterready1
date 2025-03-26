// Iexpertise defines how to create a new Expertise
export interface IExpertise {
    id:number;
    name: string;
  }

  export interface ExpertiseCreate {
    name: string;
  }
  
  export interface UserAttached {
    user_id: number;
    expertise_id: number;
  }
  
  export interface ShiftAttached {
    shift_id: number;
    expertise_id: number;
  }

  