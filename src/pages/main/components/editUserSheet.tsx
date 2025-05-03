import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { meUser, UserCreate } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { editCurrentUser } from "@/pages/teams/services/TeamService";
import { useAuth } from "@/contexts/AuthContext"; 
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; 

interface userEditSheetProps {
    user: meUser;
    setRefreshUser: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserEditSheet: React.FC<userEditSheetProps> = ({
    user,
    setRefreshUser,
    isOpen,
    setIsOpen,
}) => {
    const [email, setEmail] = useState(user.email);
    const [mobile_number, setMobile] = useState(user.mobile_number);
    const [first_name, setFname] = useState(user.first_name);
    const [last_name, setLname] = useState(user.last_name);

    const { setUser, setIsAuthenticated } = useAuth(); 
    const navigate = useNavigate();

    useEffect(() => {
        setEmail(user.email);
        setMobile(user.mobile_number);
        setFname(user.first_name);
        setLname(user.last_name);
    }, [user.first_name, user.email, user.mobile_number]);

    const handleUpdate = async () => {
        if (!email.trim() || !mobile_number.trim()) return;

        const updatedUser = await editCurrentUser({
            email,
            mobile_number,
            first_name,
            last_name,
        } as UserCreate);

        // If the email is updated, log the user out and navigate to login page
        if (updatedUser) {
            if (updatedUser.email !== user.email) {
                // Clear the access token and user data
                // This will log the user out
                // only if email is changed
                Cookies.remove("access_token"); 
                setUser(null); 
                setIsAuthenticated(false); 

                // Show an alert or message to inform the user
                alert("Email is changed. Please re-login for authorization.");

                // Navigate to login page
                navigate("/login");
            }

            setRefreshUser(true); 
            setIsOpen(false); 
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-full sm:max-w-md px-4">
                <SheetHeader>
                    <SheetTitle className="text-xl mt-2">Edit Profile</SheetTitle>
                </SheetHeader>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleUpdate();
                    }}
                    className="space-y-4"
                >
                     <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                            id="first_name"
                            value={first_name}
                            onChange={(e) => setFname(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                            id="last_name"
                            value={last_name}
                            onChange={(e) => setLname(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile_number">Mobile Number</Label>
                        <Input
                            id="mobile_number"
                            value={mobile_number}
                            onChange={(e) => setMobile(e.target.value)}
                        />
                    </div>
                   
                    <Button type="submit" className="w-full mt-2">
                        Save Changes
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default UserEditSheet;
