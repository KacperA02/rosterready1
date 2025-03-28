import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRoles } from "@/hooks/useRoles";
import { fetchTeamDetails } from "./services/TeamService"; 
import { TeamResponse,IUsers } from "@/types/team";

const TeamDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isEmployer, isEmployee } = useRoles(); 
  const [team, setTeam] = useState<TeamResponse | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadTeam = async () => {
      if (user?.team_id) {
        const fetchedTeam = await fetchTeamDetails(user.team_id);
        if (fetchedTeam) {
          setTeam(fetchedTeam);
        } else {
          setError("Error fetching team details");
        }
      } else {
        navigate("/no-team");
      }
    };

    loadTeam();
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
            {team.user_ids?.map((user: IUsers) => (
              <li key={user.id}>User: {user.first_name} {user.last_name} {user.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
