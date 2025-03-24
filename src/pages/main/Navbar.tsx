import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FC } from "react";
import LogoutButton from "@/components/buttons/logoutBtn";
import { Avatar, AvatarFallback,AvatarImage} from "@/components/ui/avatar"; 

const NavBar: FC = () => {
  const { isAuthenticated, user } = useAuth();


  return (
    <>
      {isAuthenticated && (
        <nav className="bg-gray-800 text-white p-4">
          <div className="flex justify-between items-center">
            {/* Left Side - Navigation Links */}
            <div className="flex space-x-4">
              <Link to="/" className="text-lg font-semibold hover:text-gray-400">
                Home
              </Link>
              <Link to="/teams" className="text-lg font-semibold hover:text-gray-400">
                Teams
              </Link>
              <Link to="/profile" className="text-lg font-semibold hover:text-gray-400">
                Profile
              </Link>
            </div>
            
            {/* Right Side - Avatar and Logout */}
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user?.sub || "User"}</span>

              {/* Avatar */}
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

              {/* Logout Button */}
              <LogoutButton /> {/* Use the LogoutButton component */}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default NavBar;
