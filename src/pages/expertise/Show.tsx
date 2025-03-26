import React, { useEffect, useState } from "react";
import { IExpertise } from "@/types/expertise"; 
import {fetchAllExpertise} from "@/pages/expertise/services/ExpertiseService" 
import ExpertiseCard from "./components/ExpertiseCard";

const ShowExpertise: React.FC = () => {
  const [expertises, setExpertises] = useState<IExpertise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadExpertises = async () => {
      try {
        const data = await fetchAllExpertise();
        setExpertises(data);
      } catch (error) {
        console.error("Failed to load shifts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExpertises();
  }, []);

  if (loading) {
    return <div>Loading expertises...</div>;
  }

  return (
    <div className="space-y-4">
      {expertises.length === 0 ? (
        <div>No expertises available</div>
      ) : (
        expertises.map((expertise) => (
          <ExpertiseCard key={expertise.id} expertise={expertise} />
        ))
      )}
    </div>
  );
};

export default ShowExpertise;
