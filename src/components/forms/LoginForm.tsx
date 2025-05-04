import instance from "../../config/Api";
import { useState, ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Cookies from "js-cookie";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator"; 

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [focused, setFocused] = useState({ email: false, password: false });

  const handleForm = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFocus = (field: string) => {
    setFocused((prevState) => ({
      ...prevState,
      [field]: true,
    }));
  };

  const handleBlur = (field: keyof typeof form) => {
      if (!form[field]) {
        setFocused((prevState) => ({
          ...prevState,
          [field]: false,
        }));
      }
    };

  const handleClick = async () => {
    try {
      const response = await instance.post<{ access_token: string }>("/auth/login", form);
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
      <h2 className="text-xl font-bold mb-3 text-secondary">Login</h2>
      
      {/* Email Input */}
      <div className="relative w-64 mb-4">
        <label
          htmlFor="email"
          className={`transition-all duration-300 absolute left-2 ${
            focused.email || form.email ? "text-xs top-0" : "text-sm top-2"
          }`}
        >
          Email:
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleForm}
          onFocus={() => handleFocus("email")}
          onBlur={() => handleBlur("email")}
          className="border p-2 rounded-md w-full"
        />
      </div>

      {/* Password Input */}
      <div className="relative w-64 mb-4">
        <label
          htmlFor="password"
          className={`transition-all duration-300 absolute left-2 ${
            focused.password || form.password ? "text-xs top-0" : "text-sm top-2"
          }`}
        >
          Password:
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleForm}
          onFocus={() => handleFocus("password")}
          onBlur={() => handleBlur("password")}
          className="border p-2 rounded-md w-full"
        />
      </div>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* Login Button */}
      <Button
        onClick={handleClick}
        variant={"default"}
      >
        Login
      </Button>

      {/* Forgotten Password Link */}
      <p className="text-sm text-center">
        <Link to="#" className="text-blue-500 hover:underline">
          Forgotten password?
        </Link>
      </p>

      
      <Separator className="my-4 border-t-2 border-green-500" />

      {/* Create Account Button */}
      <Button
        asChild
        className="text-secondary bg-gray-300 w-full"
      >
        <Link to="/register">Create an Account</Link>
      </Button>
    </div>
  );
};

export default LoginForm;
