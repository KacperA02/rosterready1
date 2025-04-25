import React, { useState } from "react";
import { createShift } from "./services/ShiftService";
import { ShiftCreate } from "@/types/shift";
import { Button } from "@/components/ui/button";
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
  const [task, setTask] = useState<string>("");

  const handleSubmit = async () => {
    const shiftData: ShiftCreate = {
      name,
      time_start: timeStart,
      time_end: timeEnd,
      task,
      no_of_users: noOfUsers,
    };

    const result = await createShift(shiftData);
    if (result) {
      setAlert("Shift created successfully!", "success");
      onUpdate();
      onOpenChange(false) 
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

        <div className="space-y-6 mt-6">
          <div>
            <label className="block text-sm font-semibold">Shift Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter shift name"
              className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold">Start Time</label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold">End Time</label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-semibold">Number of Users</label>
            <Tooltip>
              <TooltipTrigger>
                <AiOutlineInfoCircle className="text-lg text-gray-600 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent className="bg-gray-800 text-white text-xs rounded-lg shadow-lg p-2 max-w-xs">
                This is the number of users you want to work this shift at the same time.
              </TooltipContent>
            </Tooltip>
            <input
              type="number"
              value={noOfUsers}
              onChange={(e) => setNoOfUsers(parseInt(e.target.value))}
              min={1}
              className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold">Task (Optional)</label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter task details"
              className="border p-3 w-full rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="default" onClick={handleSubmit}>
              Create Shift
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CreateShiftSheet;
