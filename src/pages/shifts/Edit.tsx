import { useState } from "react";
import { updateShift } from "@/pages/callender/services/ShiftService";
import { ShiftCreate } from "@/types/shift";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EditShiftProps {
  shift: ShiftCreate & { id: number }; 
  onShiftUpdated: () => Promise<void>;
  onClose: () => void;
}

const EditShift: React.FC<EditShiftProps> = ({ shift, onShiftUpdated, onClose }) => {
  const [updatedShift, setUpdatedShift] = useState(shift);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUpdatedShift({
      ...updatedShift,
      [e.target.name]: e.target.value,
    });
  };

  const handleNoOfUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : 1;
    setUpdatedShift({
      ...updatedShift,
      no_of_users: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      console.log("Updating Shift:", updatedShift);

     
      const response = await updateShift(updatedShift.id, updatedShift);

      if (response) {
        alert("Shift updated successfully!");
        await onShiftUpdated();
        onClose();
      } else {
        setError("Error updating shift. Please try again.");
      }
    } catch (err) {
      setError("Error updating shift. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Shift</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Shift Name
          </label>
          <Input type="text" id="name" name="name" value={updatedShift.name} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label htmlFor="time_start" className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <Input type="time" id="time_start" name="time_start" value={updatedShift.time_start} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label htmlFor="time_end" className="block text-sm font-medium text-gray-700">
            End Time
          </label>
          <Input type="time" id="time_end" name="time_end" value={updatedShift.time_end} onChange={handleChange} required />
        </div>

        <div className="mb-4">
          <label htmlFor="task" className="block text-sm font-medium text-gray-700">
            Task (optional)
          </label>
          <Textarea id="task" name="task" value={updatedShift.task} onChange={handleChange} placeholder="Optional task description" />
        </div>

        <div className="mb-4">
          <label htmlFor="no_of_users" className="block text-sm font-medium text-gray-700">
            Number of Users
          </label>
          <Input
            type="number"
            id="no_of_users"
            name="no_of_users"
            value={updatedShift.no_of_users}
            onChange={handleNoOfUsersChange}
            min={1}
            max={5}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          {loading ? "Updating..." : "Update Shift"}
        </Button>
      </form>
    </div>
  );
};

export default EditShift;
