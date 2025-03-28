import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IExpertise } from "@/types/expertise";
import { AttachShiftSheet } from "./AttachShiftsSheet";
import { AttachUserSheet } from "./AttachUsersSheet";

interface ExpertiseCardProps {
  expertise: IExpertise;
  setRefreshShifts: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshUsers: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ expertise, setRefreshShifts, setRefreshUsers }) => {
  const { name, users, shifts, id, team_id } = expertise; 

  const [isShiftsSheetOpen, setIsShiftsSheetOpen] = useState(false);
  const [isUsersSheetOpen, setIsUsersSheetOpen] = useState(false);

  const handleAttachUsersClick = () => {
    setIsUsersSheetOpen(true);
  };

  const handleCloseUsersSheet = () => {
    setIsUsersSheetOpen(false);
  };

  const handleAttachShiftsClick = () => {
    setIsShiftsSheetOpen(true);
  };

  const handleCloseShiftsSheet = () => {
    setIsShiftsSheetOpen(false);
  };

  return (
    <>
      <Card className="p-4 shadow-lg rounded-lg border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">{name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-semibold">Users Assigned:</p>
          {users.length > 0 ? (
            <ul className="list-disc list-inside">
              {users.map((user) => (
                <li key={user.id}>
                  {user.first_name} {user.last_name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No users assigned</p>
          )}

          <p className="font-semibold">Shifts Assigned:</p>
          {shifts.length > 0 ? (
            <ul className="list-disc list-inside">
              {shifts.map((shift) => (
                <li key={shift.id}>{shift.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No shifts assigned</p>
          )}

          <Button variant="outline" className="mt-2 mr-2">
            Edit
          </Button>
          <Button
            variant="outline"
            className="mt-2"
            onClick={handleAttachUsersClick}
          >
            Attach Users
          </Button>
          <Button
            variant="outline"
            className="mt-2"
            onClick={handleAttachShiftsClick}
          >
            Attach Shifts
          </Button>
        </CardContent>
      </Card>

      {isShiftsSheetOpen && (
        <AttachShiftSheet
          expertiseId={id}
          assignedShifts={shifts}  
          onClose={handleCloseShiftsSheet}
          setRefreshShifts={setRefreshShifts}
        />
      )}
       {isUsersSheetOpen && (
        <AttachUserSheet
          expertiseId={id}
          assignedUsers={users}  
          onClose={handleCloseUsersSheet}
          setRefreshUsers={setRefreshUsers}
          teamId={team_id}
        />
      )}
    </>
  );
};

export default ExpertiseCard;
