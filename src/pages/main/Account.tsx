import { useEffect, useState } from "react";
import { fetchCurrentUser } from "@/pages/teams/services/TeamService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";
import UserEditSheet from "./components/editUserSheet";
import { deleteCurrentUser } from "@/pages/teams/services/TeamService"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"; 
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";

interface IUsers {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
}

const Account = () => {
  const [user, setUser] = useState<IUsers | null>(null);
  const { theme, toggleTheme } = useTheme();
  const [refreshUser, setRefreshUser] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); 
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth(); 

  useEffect(() => {
    const getUserData = async () => {
      const userData = await fetchCurrentUser();
      if (userData) {
        setUser(userData);
      }
    };

    getUserData();
  }, [refreshUser]);

  const handleChangePassword = () => {
    alert("Change Password functionality is not implemented yet.");
  };

  const handleEditDetails = () => {
    setIsOpen(true);
  };

  const handleDeleteAccount = async () => {
    const success = await deleteCurrentUser();
    if (success) {
      
      alert("Your account has been deleted successfully.");
		Cookies.remove("access_token"); 
                setIsAuthenticated(false);
                navigate("/login");
    } else {
      alert("An error occurred while deleting your account. Please try again.");
    }
    setIsDeleteDialogOpen(false); 
  };

  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);
  const openDeleteDialog = () => setIsDeleteDialogOpen(true);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Account Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600">First Name</label>
                <Input value={user.first_name} readOnly className="w-full" disabled />
              </div>
              <div>
                <label className="block text-gray-600">Last Name</label>
                <Input value={user.last_name} readOnly className="w-full" disabled />
              </div>
              <div>
                <label className="block text-gray-600">Email</label>
                <Input value={user.email} readOnly className="w-full" disabled />
              </div>
              <div>
                <label className="block text-gray-600">Mobile Number</label>
                <Input value={user.mobile_number} readOnly className="w-full" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button
            onClick={handleEditDetails}
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            Edit Details
          </Button>
          <Button
            onClick={handleChangePassword}
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Change Password
          </Button>
          <Button
            onClick={openDeleteDialog}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Delete Account
          </Button>
        </div>
      </div>

      <Button
        onClick={toggleTheme}
        className="w-full bg-gray-500 hover:bg-gray-600 flex items-center justify-center mb-4"
      >
        {theme === "light" ? <FaMoon className="mr-2" /> : <FaSun className="mr-2" />}
        Toggle Theme
      </Button>

      <UserEditSheet user={user} setRefreshUser={setRefreshUser} setIsOpen={setIsOpen} isOpen={isOpen} />

      {/* Confirmation Dialog for Deleting Account */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-2">Are you sure you want to delete your account?</DialogTitle>
            <DialogDescription className="mt-2">
              This action will delete all your data, including data within your team, and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={handleDeleteAccount}
              variant={"destructive"}
            >
              Yes, Delete Account
            </Button>
            <Button
              onClick={closeDeleteDialog}
              variant={"default"}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;
