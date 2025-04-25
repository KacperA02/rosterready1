import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShiftResponse } from "@/types/shift";
import { useState } from "react";
import DaysAttach from "../DaysAttach";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EditShift from "../Edit";
import { deleteShift } from "../services/ShiftService"; 
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ShiftCardProps {
  shift: ShiftResponse;
  onUpdate: () => void;
}

const ShiftCard: React.FC<ShiftCardProps> = ({ shift, onUpdate }) => {
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const getDaysButtonLabel = () => {
    const len = shift.days.length;
    if (len === 0) return "Attach Days";
    if (len === 7) return "Remove Days";
    return "Edit Repeated Days";
  };

  const handleDelete = async () => {
    const success = await deleteShift(shift.id);
    if (success) {
      onUpdate(); 
      setOpenDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="p-4 shadow-lg rounded-lg border">
        <CardHeader className="flex justify-center">
          <CardTitle className="text-xl capitalize font-bold">{shift.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-8">
          {/* Left Content */}
          <div className="space-y-2 flex-1">
            <p>
              <strong>Time:</strong> {shift.time_start} - {shift.time_end}
            </p>
            <p>
              <strong>Users Required:</strong> {shift.no_of_users}
            </p>
            <p>
              <strong>Days:</strong>
              <div className="flex flex-wrap gap-2 mt-1">
                {shift.days.length > 0 ? (
                  <TooltipProvider>
                    {shift.days.map((day) => (
                      <Tooltip key={day.id}>
                        <TooltipTrigger asChild>
                          <div className="w-8 h-8 flex items-center justify-center text-black rounded-full bg-stone-400 text-sm cursor-default">
                            {day.name.slice(0, 2).toUpperCase()}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p>{day.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                ) : (
                  <span className="text-muted-foreground ml-2">No days attached</span>
                )}
              </div>
            </p>
          </div>

          {/* Right Content */}
          <div className="flex flex-col justify-between items-end w-48">
            <div className="text-right">
              <p>
                <strong>Task:</strong> {shift.task ?? "No task assigned"}
              </p>
            </div>
            <div className="mt-4 flex space-x-2 justify-end">
            <Button variant="default" onClick={() => setOpenEditDialog(true)}>
                Edit Shift Details
              </Button>
              <Button variant="link" onClick={() => setOpen(true)}>
                {getDaysButtonLabel()}
              </Button>
              <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Delete Shift</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div>This shift will be permanently deleted.</div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction style={{ backgroundColor: 'red', color: 'white' }}   onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Days Attach */}
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white">
            <DaysAttach
              shiftId={shift.id}
              currentDays={shift.days}
              onClose={() => setOpen(false)}
              onUpdate={onUpdate}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal for Editing Shift */}
      <EditShift
        shift={shift}
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default ShiftCard;
