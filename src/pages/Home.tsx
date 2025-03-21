import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import LogoutButton from "../components/buttons/logoutBtn";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login"); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to Roster Ready</h1>
      {isAuthenticated ? (
    
        <>
          <p className="text-lg font-semibold mt-4">You are logged in.</p>
          <LogoutButton /> {/* Logout button component */}
        </>
      ) : (
        
        <>
          <p className="text-lg font-semibold mt-4">Please log in to continue.</p>
          <Button className="mt-4" onClick={handleLoginRedirect}>
            Login
          </Button>
        </>
      )}
    </div>
  );
}
