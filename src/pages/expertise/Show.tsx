import React, { useEffect, useState } from "react";
import { IExpertise } from "@/types/expertise"; 
import { fetchAllExpertise } from "@/pages/expertise/services/ExpertiseService"; 
import ExpertiseCard from "./components/ExpertiseCard";
import ExpertiseCreateSheet from "./components/ExpertiseSheet"; 

const ShowExpertise: React.FC = () => {
  const [expertises, setExpertises] = useState<IExpertise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshShifts, setRefreshShifts] = useState(false);
  const [refreshUsers, setRefreshUsers] = useState(false);
  const [refreshExpertises, setRefreshExpertises] = useState(false);

  useEffect(() => {
    const loadExpertises = async () => {
      try {
        const data = await fetchAllExpertise();
        setExpertises(data);
      } catch (error) {
        console.error("Failed to load expertises:", error);
      } finally {
        setLoading(false);
        setRefreshShifts(false);
        setRefreshUsers(false)
        setRefreshExpertises(false);
      }
    };

    loadExpertises();
  }, [refreshShifts, refreshUsers,refreshExpertises]);

  const handleExpertiseCreated = (newExpertise: IExpertise) => {
    setExpertises((prev) => [...prev, newExpertise]); 
  };

  if (loading) {
    return <div>Loading expertises...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Create New Expertise Button */}
      
      <div className="flex justify-end ">
        <ExpertiseCreateSheet onExpertiseCreated={handleExpertiseCreated} />
      </div>
    
      {/* Expertise List */}
      {expertises.length === 0 ? (
        <div className="text-gray-500"><h1>No expertises available</h1></div>
      ) : (
        expertises.map((expertise) => (
          <ExpertiseCard key={expertise.id} setRefreshShifts={setRefreshShifts} setRefreshUsers={setRefreshUsers}  expertise={expertise}  setRefreshExpertises={setRefreshExpertises} />
        ))
      )}
    </div>
  );
};

export default ShowExpertise;
