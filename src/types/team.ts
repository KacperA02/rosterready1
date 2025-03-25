export interface Team {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface TeamCreate {
    name: string;
  }
  
  export interface TeamResponse {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  }
  