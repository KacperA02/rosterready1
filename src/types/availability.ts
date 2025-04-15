export interface UserAvailability {
    id: number;
    approved: boolean;
    reason: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
    };
    day: {
      id: number;
      name: string;
    };
    team: {
      id: number;
      name: string;
    };
    start_time: string;
    end_time: string;
  }
  