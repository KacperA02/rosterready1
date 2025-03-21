import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";

// Define User type (adjust based on your JWT payload structure)
interface User {
  id: string;
  email: string;
  role?: string; // Optional if roles exist in JWT
}

// Define AuthContext Type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuth: boolean) => void;
}

// Create AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Props
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = Cookies.get("access_token");

    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split(".")[1])) as User; 
        setUser(decodedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, setUser, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook for using AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
