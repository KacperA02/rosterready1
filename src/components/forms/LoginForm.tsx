import axios from "../../config/Api";
import { useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Cookies from "js-cookie";
import { Button } from "../ui/button";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();  
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  
  const handleForm = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

 
  const handleClick = async () => {
    try {
      const response = await axios.post<{ access_token: string }>("/auth/login", form);
      const { access_token } = response.data;
      Cookies.set("access_token", access_token, { expires: 7 });
      const decodedUser = JSON.parse(atob(access_token.split(".")[1]));
      console.log("Decoded User:", decodedUser);

      setUser(decodedUser);
      setIsAuthenticated(true);
      navigate("/");
      window.location.reload();
    } catch (err: any) {
      console.error("Login Error:", err);
      setErrorMessage(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-2 justify-items-center m-3 p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-3">Login</h2>
      <label>Email:</label>
      <input 
        type="email" 
        name="email" 
        value={form.email} 
        onChange={handleForm} 
        className="border p-2 rounded-md w-64"
      />
      <label>Password:</label>
      <input 
        type="password" 
        name="password" 
        value={form.password} 
        onChange={handleForm} 
        className="border p-2 rounded-md w-64"
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <Button 
        onClick={handleClick} 
        className="text-black bg-red"
      >
        Login
      </Button>
      <p className="mt-2">
        or <b><Link to="/register">Register</Link></b>
      </p>
    </div>
  );
};

export default LoginForm;
