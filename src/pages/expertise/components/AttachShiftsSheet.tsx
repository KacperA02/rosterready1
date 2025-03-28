import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShiftResponse } from "@/types/shift";
import { IShift } from "@/types/expertise";
import { fetchShifts } from "@/pages/callender/services/ShiftService";
import { assignExpertiseToShift } from "../services/ExpertiseService";

interface ShiftsSheetProps {
  expertiseId: number;
  assignedShifts: IShift[];
  onClose: () => void;
  setRefreshShifts: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AttachShiftSheet: React.FC<ShiftsSheetProps> = ({
  expertiseId,
  assignedShifts,
  onClose,
  setRefreshShifts,
}) => {
  const [shifts, setShifts] = useState<ShiftResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadShifts = async () => {
      const fetchedShifts = await fetchShifts();

      // Filter out already assigned shifts
      const availableShifts = fetchedShifts.filter(
        (shift) => !assignedShifts.some((assigned) => assigned.id === shift.id)
      );

      setShifts(availableShifts);
      setLoading(false); 
    };

    loadShifts();
  }, [assignedShifts]);

  const handleAssignShift = async (shiftId: number) => {
    const result = await assignExpertiseToShift(expertiseId, shiftId);
    if (result) {
      alert("Shift assigned successfully!");
      setRefreshShifts(true);
      onClose();
    } else {
      alert("Error assigning shift.");
    }
  };

  if (loading) {
    return <div>Loading shifts...</div>;
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 bg-gray-800 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Assign Shift</h2>

        {shifts.length > 0 ? (
          <ul className="space-y-2">
            {shifts.map((shift) => (
              <li key={shift.id} className="p-2 cursor-pointer rounded-lg hover:bg-gray-200">
                <div className="flex items-center justify-between">
                  <span>{shift.name}</span>
                  <Button
                    variant="outline"
                    onClick={() => handleAssignShift(shift.id)} // Assign shift on click
                  >
                    Assign
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No available shifts</p>
        )}

        <div className="mt-4">
          <Button variant="outline" className="ml-2" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
