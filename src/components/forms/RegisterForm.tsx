import axios from "../../config/Api";
import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/react-alert-dialog";

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
//   REGEX FOR EMAIL + REQUIREMENT FOR PHONE
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    <div className="grid grid-cols-1 gap-2 justify-items-center m-3 p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-3">Register</h2>
      <label>First Name:</label>
      <input 
        type="text" 
        name="first_name" 
        value={form.first_name} 
        onChange={handleForm} 
        className="border p-2 rounded-md w-64"
        required
      />
      <label>Last Name:</label>
      <input 
        type="text" 
        name="last_name" 
        value={form.last_name} 
        onChange={handleForm} 
        className="border p-2 rounded-md w-64"
        required
      />
      <label>Email:</label>
      <input 
        type="email" 
        name="email" 
        value={form.email} 
        onChange={handleForm} 
        className="border p-2 rounded-md w-64"
        required
      />
      <label>Mobile Number:</label>
      <input 
        type="text" 
        name="mobile_number" 
        value={form.mobile_number} 
        onChange={handleForm} 
        className="border p-2 rounded-md w-64"
        required
      />
      <label>Password:</label>
      <input 
        type="password" 
        name="password" 
        value={form.password} 
        onChange={handleForm} 
        className="border p-2 rounded-md w-64"
        required
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      
      <Button onClick={handleClick} className="text-black bg-green-500">
        Register
      </Button>
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Successful</AlertDialogTitle>
            <AlertDialogDescription>
              Your account has been created successfully. Please log in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => navigate("/login")}>
              Go to Login
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegisterForm;
