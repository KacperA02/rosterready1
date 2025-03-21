import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const { setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("access_token"); // Remove token from cookies
    setUser(null); // Clear user state
    setIsAuthenticated(false); // Mark as not authenticated
    navigate("/login"); // Redirect to login page
  };

  return (
    <Button
      onClick={handleLogout}
      className="text-black p-2 rounded-md w-32 hover:bg-red-600"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
