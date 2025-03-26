import React, { useEffect, useState } from "react";
import { ShiftResponse } from "@/types/shift"; 
import { fetchShifts } from "../callender/services/ShiftService";
import ShiftCard from "./components/ShiftCard"; 

const ShowShift: React.FC = () => {
  const [shifts, setShifts] = useState<ShiftResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadShifts = async () => {
      try {
        const data = await fetchShifts();
        setShifts(data);
      } catch (error) {
        console.error("Failed to load shifts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadShifts();
  }, []);

  if (loading) {
    return <div>Loading shifts...</div>;
  }

  return (
    <div className="space-y-4">
      {shifts.length === 0 ? (
        <div>No shifts available</div>
      ) : (
        shifts.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} />
        ))
      )}
    </div>
  );
};

export default ShowShift;
