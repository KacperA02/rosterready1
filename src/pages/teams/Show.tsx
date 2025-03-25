import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import instance from "@/config/Api";
import { useAuth } from "@/contexts/AuthContext";
import { useRoles } from "@/hooks/useRoles";

const TeamDetails = () => {
  const navigate = useNavigate(); // Initialize navigate
  const { user } = useAuth();
  const { isAdmin, isEmployer, isEmployee } = useRoles(); 
  const [team, setTeam] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (user?.team_id) {
      instance
        .get(`/teams/${user.team_id}`, {withCredentials: true}
          
        )
        .then((response) => {
          setTeam(response.data);
        })
        .catch((err) => {
          if (err.response?.status === 401) {
            setError("Login Token Expired");
          } else {
            setError("Error fetching team details");
          }
          console.error(err);
        });
    } else {
      navigate("/no-team"); 
    }
  }, [user, navigate]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!team) {
    return <div>Loading...</div>;
  }

  return (
    <div className="team-details p-4 border rounded-lg shadow-md bg-white">
      <h1 className="text-xl font-bold">{team.name}</h1>

      {isEmployee() && !isAdmin() && !isEmployer() && (
        <p className="text-gray-600">You are a team member.</p>
      )}

      {(isAdmin() || isEmployer()) && (
        <div>
          <p className="mt-2">Creator ID: {team.creator_id}</p>
          <h2 className="mt-4 font-semibold">Team Members:</h2>
          <ul className="list-disc pl-5">
            {team.user_ids?.map((id: number) => (
              <li key={id}>User ID: {id}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
