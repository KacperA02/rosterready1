import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TeamUser } from "@/types/team";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  users: TeamUser[];
}

// search bar for narrowing employees by any of the following: first name, last name, email, mobile number
const EmployeeComp = ({ users }: Props) => {
  const [search, setSearch] = useState("");
  const {user} = useAuth()
  const filteredUsers = users.filter(
    (userItem) =>
      userItem.email !== user?.sub && 
      [userItem.first_name, userItem.last_name, userItem.email, userItem.mobile_number]
        .some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  );


  return (
    <div className="space-y-6">
      <Input
        placeholder="Search by name, email or mobile number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md mx-auto"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="rounded-2xl shadow-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">
                {user.first_name} {user.last_name}
              </h2>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Contact</h4>
                <Separator className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  📧 {user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  📱 {user.mobile_number}
                </p>
              </div>
              <Button variant="destructive" className=" text-black w-full">
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EmployeeComp;
