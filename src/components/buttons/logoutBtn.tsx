import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Button } from "../ui/button";

const LogoutButton = () => {
  const { setUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("access_token"); 
    setUser(null); 
    setIsAuthenticated(false); 
    navigate("/login"); 
  };

  return (
    <Button
      onClick={handleLogout}
      variant={"secondary"}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
