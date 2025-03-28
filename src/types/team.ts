export interface Team {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
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
    user_ids: IUsers[];
  }
  