import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IExpertise } from "@/types/expertise";
import { AttachShiftSheet } from "./AttachShiftsSheet";
import { AttachUserSheet } from "./AttachUsersSheet";
import ExpertiseEditSheet from "./ExpertiseEditSheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { deleteExpertise } from "../services/ExpertiseService";
import { PlusIcon } from "lucide-react";

interface ExpertiseCardProps {
  expertise: IExpertise;
  setRefreshShifts: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshUsers: React.Dispatch<React.SetStateAction<boolean>>;
  setRefreshExpertises: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({
  expertise,
  setRefreshShifts,
  setRefreshUsers,
  setRefreshExpertises,
}) => {
  const { name, users, shifts, id, team_id } = expertise;

  const [isShiftsDialogOpen, setIsShiftsDialogOpen] = useState(false);
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleAttachUsersClick = () => setIsUsersDialogOpen(true);
  const handleCloseUsersDialog = () => setIsUsersDialogOpen(false);
  const handleAttachShiftsClick = () => setIsShiftsDialogOpen(true);
  const handleCloseShiftsDialog = () => setIsShiftsDialogOpen(false);

  const handleDelete = async () => {
    const result = await deleteExpertise(id);
    if (result !== null) {
      setRefreshExpertises(true);
    }
    setIsDeleteDialogOpen(false);
  };

  const getUserInitials = (user: { first_name: string; last_name: string }) =>
    `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();

  const getShiftInitials = (shiftName: string) =>
    shiftName.slice(0, 2).toUpperCase();

  return (
    <>
      <Card className="p-4 shadow-lg rounded-lg border">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold capitalize">{name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Users Assigned Section */}
          <div className="flex items-start gap-2">
            <p className="font-semibold mt-1">Users Assigned:</p>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                {users.length > 0 ? (
                  users.map((user) => (
                    <Tooltip key={user.id}>
                      <TooltipTrigger asChild>
                        <div className="w-8 h-8 flex items-center justify-center text-black rounded-full bg-stone-400 text-sm cursor-default">
                          {getUserInitials(user)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{`${user.first_name} ${user.last_name}`}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))
                ) : (
                  <p className="text-gray-500">No users assigned</p>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="w-8 h-8 flex items-center justify-center text-white rounded-full bg-stone-500 text-sm cursor-pointer"
                      onClick={handleAttachUsersClick}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Add or remove users</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Shifts Assigned Section */}
          <div className="flex items-start gap-2 mt-4">
            <p className="font-semibold mt-1">Shifts Assigned:</p>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                {shifts.length > 0 ? (
                  shifts.map((shift) => (
                    <Tooltip key={shift.id}>
                      <TooltipTrigger asChild>
                        <div className="w-8 h-8 flex items-center justify-center text-black rounded-full bg-stone-400 text-sm cursor-default">
                          {getShiftInitials(shift.name)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>{shift.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))
                ) : (
                  <p className="text-gray-500">No shifts assigned</p>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="w-8 h-8 flex items-center justify-center text-white rounded-full bg-stone-500 text-sm cursor-pointer"
                      onClick={handleAttachShiftsClick}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Add or remove shifts</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end flex-wrap gap-2">
            <ExpertiseEditSheet
              expertise={expertise}
              setRefreshExpertises={setRefreshExpertises}
            />
            <Button
              variant="destructive"
              className="mt-2"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shifts Sheet Dialog */}
      <Dialog open={isShiftsDialogOpen} onOpenChange={setIsShiftsDialogOpen}>
        <DialogContent className="">
          <AttachShiftSheet
            expertiseId={id}
            assignedShifts={shifts}
            onClose={handleCloseShiftsDialog}
            setRefreshShifts={setRefreshShifts}
          />
        </DialogContent>
      </Dialog>

      {/* Users Sheet Dialog */}
      <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
        <DialogContent className="">
          <AttachUserSheet
            expertiseId={id}
            assignedUsers={users}
            onClose={handleCloseUsersDialog}
            setRefreshUsers={setRefreshUsers}
            teamId={team_id}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete this skill.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              style={{ backgroundColor: "red", color: "white" }}
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ExpertiseCard;
