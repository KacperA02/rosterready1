import { useAuth } from "@/contexts/AuthContext";
import { RoleName } from "@/types/user";

// Custom hook to check user roles
export const useRoles = () => {
  const { user } = useAuth();

  const userRoles: RoleName[] = user?.roles ?? [];

  
  const hasRole = (roles: RoleName[]): boolean => {
    return roles.some(role => userRoles.includes(role));
  };

  // Specific role-checking functions
  const isAdmin = () => hasRole([RoleName.ADMIN]);
  const isCustomer = () => hasRole([RoleName.CUSTOMER]);
  const isEmployer = () => hasRole([RoleName.EMPLOYER]);
  const isEmployee = () => hasRole([RoleName.EMPLOYEE]);

  return { isAdmin, isCustomer, isEmployer, isEmployee, hasRole };
};
