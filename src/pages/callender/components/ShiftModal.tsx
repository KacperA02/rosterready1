import React, { useState } from "react";
import { ShiftCreate, ShiftResponse } from "@/types/shift"; 
// Import API methods for creating and updating shifts
import { createShift, updateShift } from "../services/ShiftService"; 

// Define props for the ShiftModal component
interface ShiftModalProps {
  // Boolean to control modal visibility
  isOpen: boolean; 
  // Function to close the modal
  closeModal: () => void; 
  // Optional shift data for editing mode
  shiftToEdit?: ShiftResponse; 
}

const ShiftModal: React.FC<ShiftModalProps> = ({ isOpen, closeModal, shiftToEdit }) => {
  // Manage shift data state, initializing with existing values if editing
  const [shiftData, setShiftData] = useState<ShiftCreate>({
    name: shiftToEdit?.name || "",
    time_start: shiftToEdit?.time_start || "",
    time_end: shiftToEdit?.time_end || "",
    task: shiftToEdit?.task || "",
    no_of_users: shiftToEdit?.no_of_users || 0,
  });

  // Handle form submission for creating or updating a shift
  const handleSubmit = async () => {
    try {
      if (shiftToEdit) {
        // If shiftToEdit exists, update the existing shift
        await updateShift(shiftToEdit.id, shiftData);
      } else {
        // Otherwise, create a new shift
        await createShift(shiftData);
      }
      closeModal(); // Close the modal after successful operation
    } catch (error) {
      console.error("Error submitting shift:", error); // Log any errors
    }
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div>
      {/* Display form title based on mode (edit or create) */}
      <h3>{shiftToEdit ? "Edit Shift" : "Create Shift"}</h3>
      <form>
        {/* Input field for shift name */}
        <label>
          Name:
          <input
            type="text"
            value={shiftData.name}
            onChange={(e) => setShiftData({ ...shiftData, name: e.target.value })}
          />
        </label>

        {/* Input field for shift start time */}
        <label>
          Start Time:
          <input
            type="datetime-local"
            value={shiftData.time_start}
            onChange={(e) => setShiftData({ ...shiftData, time_start: e.target.value })}
          />
        </label>

        {/* Input field for shift end time */}
        <label>
          End Time:
          <input
            type="datetime-local"
            value={shiftData.time_end}
            onChange={(e) => setShiftData({ ...shiftData, time_end: e.target.value })}
          />
        </label>

        {/* Submit button to create or update shift */}
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>

        {/* Cancel button to close the modal */}
        <button type="button" onClick={closeModal}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ShiftModal;
