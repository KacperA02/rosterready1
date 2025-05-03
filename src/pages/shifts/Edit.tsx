import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateShift } from "./services/ShiftService";
import { ShiftResponse, ShiftCreate } from "@/types/shift";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface EditShiftProps {
  shift: ShiftResponse;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const EditShift: React.FC<EditShiftProps> = ({ shift, open, onClose, onUpdate }) => {
  const [formData, setFormData] = useState<ShiftCreate>({
    name: shift.name,
    time_start: shift.time_start,
    time_end: shift.time_end,
    no_of_users: shift.no_of_users
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedShift = await updateShift(shift.id, formData);

    if (updatedShift) {
      onUpdate();
      onClose();
    } else {
      alert("Failed to update the shift.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Shift</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 px-4">
          <div className="space-y-2">
            <Label htmlFor="name">Shift Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Shift Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="time_start">Start Time</Label>
              <Input
                id="time_start"
                name="time_start"
                type="time"
                value={formData.time_start}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time_end">End Time</Label>
              <Input
                id="time_end"
                name="time_end"
                type="time"
                value={formData.time_end}
                onChange={handleChange}
              />
            </div>
          </div>


          <div className="space-y-2">
            <Label htmlFor="no_of_users">Users Required</Label>
            <Input
              id="no_of_users"
              name="no_of_users"
              type="number"
              value={formData.no_of_users}
              onChange={handleChange}
              placeholder="Number of users"
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

export default EditShift;
