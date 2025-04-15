export interface Team {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    expertise_count: number;
    employee_count: number;
    shift_count: number;
  }
  
  export interface TeamCreate {
    name: string;
  }

  export interface IUsers {
    id: number;
    first_name:string;
    last_name:string;
    email:string;
  }
  
  export interface TeamResponse {
    id: number;
    name: string;
    creator_id:string;
    created_at: string;
    updated_at: string;
    expertise_count: number;
    employee_count: number;
    shift_count: number;
    user_ids: IUsers[];
  }
  export interface TeamInvitation {
    id: number;
    user_id: number;
    team_id: number;
    status: "PENDING" | "ACCEPTED" | "DECLINED";
    created_at: string;
  }
  