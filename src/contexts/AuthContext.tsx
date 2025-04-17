import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import { AuthContextType, User } from "@/types/user";


// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);


  const decodeAndSetUser = () => {
    const tokenFromCookie = Cookies.get("access_token");

    if (tokenFromCookie) {
      try {
        const decodedUser = JSON.parse(atob(tokenFromCookie.split(".")[1])) as User;
        setUser(decodedUser);
        setIsAuthenticated(true);
        setToken(tokenFromCookie);
        // console.log("User decoded from token:", decodedUser);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
        setIsAuthenticated(false);
        setToken(null);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setToken(null);
    }
  };


  useEffect(() => {
    decodeAndSetUser();
    setLoading(false);
  }, []);




  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated, loading, setUser, setIsAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
