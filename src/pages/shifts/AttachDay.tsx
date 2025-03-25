import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label";
import instance from "../../config/Api";
import { useNavigate } from "react-router-dom";

// Days of the week mapped to IDs
const daysOfWeek = [
  { id: 1, name: "Monday" },
  { id: 2, name: "Tuesday" },
  { id: 3, name: "Wednesday" },
  { id: 4, name: "Thursday" },
  { id: 5, name: "Friday" },
  { id: 6, name: "Saturday" },
  { id: 7, name: "Sunday" },
];

interface AttachDaysShiftProps {
  shiftId?: string;
}

const AttachDaysShift = ({ shiftId }: AttachDaysShiftProps) => {
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  // Handle changes in day selection (correct type)
  const handleDayChange = (id: number, checked: boolean) => {
    setSelectedDays((prevSelectedDays) =>
      checked
        ? [...prevSelectedDays, id] 
        : prevSelectedDays.filter((day) => day !== id) 
    );
  };

  // Submit the selected days for the shift
  const handleSubmit = async () => {
    if (selectedDays.length === 0) {
      setError("Please select at least one day.");
      return;
    }
    console.log(selectedDays)
    try {
      await instance.post(`/shifts/days/${shiftId}`, {
        day_ids: selectedDays
      });
      setSuccess("Days successfully attached to the shift.");
      navigate(`/shift-expertise/${shiftId}`);
      setError(""); 
    } catch (err: any) {
      setError("Failed to attach days. Please try again.");
      setSuccess(""); 
      console.error("Error attaching days:", err);
    }
  };

  return (
    <div className="p-6 border rounded-lg max-w-sm mx-auto">
      <h3 className="text-xl font-semibold mb-4">Attach Days to Shift</h3>

      <div className="space-y-4">
        {daysOfWeek.map((day) => (
          <div key={day.id} className="flex items-center space-x-2">
            <Checkbox
              id={`day-${day.id}`} 
              checked={selectedDays.includes(day.id)}  
              onCheckedChange={(checked) => handleDayChange(day.id, !!checked)} 
              className="peer"
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor={`day-${day.id}`} className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {day.name}
              </Label>
              <p className="text-sm text-muted-foreground">
                You can attach this day to the shift.
              </p>
            </div>
          </div>
        ))}
      </div>
      

      <Button
        className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
        onClick={handleSubmit}
        disabled={selectedDays.length === 0}  
      >
        Attach Days
      </Button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default AttachDaysShift;
