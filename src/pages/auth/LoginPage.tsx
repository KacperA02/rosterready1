import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "../../components/forms/LoginForm";
import { Home } from "lucide-react"; // Importing the Home icon from lucide-react

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home if already authenticated
    }
  }, [isAuthenticated, navigate]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="pb-36 flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm">
        {/* Home Icon Link */}
        <div
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 flex items-center space-x-2 cursor-pointer"
        >
          <Home size={24} className="text-gray-500 hover:text-gray-700" />
          <span className="text-gray-500 hover:text-gray-700">Home</span>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
