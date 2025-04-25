import axios from "../../config/Api";
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/react-alert-dialog";
import { Home } from "lucide-react"; 

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile_number: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleForm = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) => /^\d{10}$/.test(phone);

  const handleClick = async () => {
    if (!form.first_name || !form.last_name || !form.email || !form.mobile_number || !form.password) {
      setErrorMessage("All fields are required.");
      return;
    }
    if (!isValidEmail(form.email)) {
      setErrorMessage("Invalid email format.");
      return;
    }
    if (!isValidPhone(form.mobile_number)) {
      setErrorMessage("Invalid phone number. It must be exactly 10 digits.");
      return;
    }
    try {
      await axios.post("/users", form);
      setErrorMessage("");
      setIsDialogOpen(true);
    } catch (err: any) {
      console.error("Registration Error:", err);
      setErrorMessage(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex justify-center items-center bg-gray-100">
      {/* Home Button */}
      <div
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center space-x-2 cursor-pointer z-50"
      >
        <Home size={24} className="text-gray-500 hover:text-gray-700" />
        <span className="text-gray-500 hover:text-gray-700">Home</span>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md p-6 bg-white border rounded-lg shadow-md">
        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-green-600 mb-4">
          Roster<span className="text-black">Ready</span>
        </h1>

        {/* Form */}
        <label>First Name:</label>
        <input
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleForm}
          className="border p-2 rounded-md w-full mb-2"
          required
        />
        <label>Last Name:</label>
        <input
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleForm}
          className="border p-2 rounded-md w-full mb-2"
          required
        />
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleForm}
          className="border p-2 rounded-md w-full mb-2"
          required
        />
        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobile_number"
          value={form.mobile_number}
          onChange={handleForm}
          className="border p-2 rounded-md w-full mb-2"
          required
        />
        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleForm}
          className="border p-2 rounded-md w-full mb-4"
          required
        />

        {/* Error message */}
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        {/* Sign Up Button */}
        <Button onClick={handleClick} className="w-full text-white bg-green-500 hover:bg-green-600 mb-4">
          Sign Up
        </Button>

        {/* Separator */}
        <Separator className="my-4 bg-gray-300" />

        {/* Login Redirect */}
        <p className="text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

        {/* Dialog */}
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Registration Successful</AlertDialogTitle>
              <AlertDialogDescription>
                Your account has been created successfully. Please log in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button onClick={() => navigate("/login")}>Go to Login</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default RegisterForm;
