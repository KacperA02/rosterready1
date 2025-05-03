import { useState } from "react";
import { createUserAvailability } from "../services/userAvailabilities";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
type Props = {
  onCreated: () => void;
};

const dayOptions = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

const CreateAvailabilityForm = ({ onCreated }: Props) => {
  const [dayIds, setDayIds] = useState<number[]>([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (dayId: number) => {
    setDayIds((prev) =>
      prev.includes(dayId)
        ? prev.filter((id) => id !== dayId)
        : [...prev, dayId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (dayIds.length === 0 || reason.trim() === "") {
      toast.error("All fields are required.");
      return;
    }

    setLoading(true);

    const availabilityData = {
      day_ids: dayIds,
      reason: reason,
    };

    const res = await createUserAvailability(availabilityData);

    setLoading(false);

    if (res) {
      toast.success("Availability created successfully!");
      onCreated();
    } else {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="p-2 bg-white rounded-lg shadow-md max-w-lg ">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="pb-4 capitalize"><b>Select Days</b></Label>
          <div className="grid grid-cols-2 gap-4">
            {dayOptions.map((day) => (
              <div key={day.value} className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id={`day-${day.value}`}
                  checked={dayIds.includes(day.value)}
                  onChange={() => handleCheckboxChange(day.value)}
                  className="h-4 w-4"
                />
                <Label htmlFor={`day-${day.value}`} className="text-sm">
                  {day.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2">Reason</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter your reason"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Availability"}
        </Button>
      </form>
    </div>
  );
};

export default CreateAvailabilityForm;
