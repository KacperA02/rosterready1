export enum RoleName {
  ADMIN = "Admin",
  CUSTOMER = "Customer",
  EMPLOYEE = "Employee",
  EMPLOYER = "Employer",
}

export interface User {
  sub: string;
  team_id: number;
  roles: RoleName[]; 
}
export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (isAuth: boolean) => void;
  }