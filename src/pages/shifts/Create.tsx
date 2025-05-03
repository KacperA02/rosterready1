import { useState } from "react";
import { createShift } from "./services/ShiftService";
import { ShiftCreate } from "@/types/shift";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const CreateShiftSheet: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
  setAlert: (message: string, type: "success" | "error") => void;
}> = ({ open, onOpenChange, onUpdate, setAlert }) => {
  const [name, setName] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [noOfUsers, setNoOfUsers] = useState<number>(1);

  const handleSubmit = async () => {
    const shiftData: ShiftCreate = {
      name,
      time_start: timeStart,
      time_end: timeEnd,
      no_of_users: noOfUsers,
    };

    const result = await createShift(shiftData);
    if (result) {
      setAlert("Shift created successfully!", "success");
      onUpdate();
      onOpenChange(false);
    } else {
      setAlert("Failed to create shift.", "error");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Create New Shift</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="mt-6 space-y-4 px-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Shift Name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter shift name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time_start">Start Time</Label>
              <Input
                id="time_start"
                name="time_start"
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time_end">End Time</Label>
              <Input
                id="time_end"
                name="time_end"
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="no_of_users">Users Required</Label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AiOutlineInfoCircle className="text-lg text-gray-600 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white text-xs rounded-lg shadow-lg p-2 max-w-xs">
                  This is the number of users you want to work this shift at the same time.
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="no_of_users"
              name="no_of_users"
              type="number"
              value={noOfUsers}
              min={1}
              onChange={(e) => setNoOfUsers(parseInt(e.target.value))}
              placeholder="Number of users"
            />
          </div>


          <Button type="submit" className="w-full mt-2">
            Create Shift
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default CreateShiftSheet;
