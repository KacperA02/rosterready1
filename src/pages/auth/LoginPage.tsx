import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoginForm from "../../components/forms/LoginForm";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="pb-36 flex justify-center items-center min-h-screen">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
