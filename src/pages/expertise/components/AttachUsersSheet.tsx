import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/expertise";
import { fetchTeamDetails } from "@/pages/teams/services/TeamService"; 
import { assignExpertiseToUser } from "../services/ExpertiseService"; // New function to assign expertise to user

interface UsersSheetProps {
  expertiseId: number;
  assignedUsers: IUser[]; 
  onClose: () => void;
  setRefreshUsers: React.Dispatch<React.SetStateAction<boolean>>;
  teamId: number; 
}

export const AttachUserSheet: React.FC<UsersSheetProps> = ({
  expertiseId,
  assignedUsers,
  onClose,
  setRefreshUsers,
  teamId, 
}) => {
  const [teamUsers, setTeamUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const loadTeamDetails = async () => {
      const teamDetails = await fetchTeamDetails(teamId); 

      if (teamDetails) {
        const availableUsers = teamDetails.user_ids
          .filter((user: IUser) => !assignedUsers.some((assignedUser) => assignedUser.id === user.id));

        setTeamUsers(availableUsers); // Populate the available users list
        setLoading(false); // Set loading to false when data is fetched
      } else {
        alert("Error fetching team details.");
      }
    };

    loadTeamDetails();
  }, [teamId, assignedUsers]); 

  const handleAssignUser = async (userId: number) => {
    const result = await assignExpertiseToUser(expertiseId, userId); 
    if (result) {
      alert("User assigned successfully!");
      setRefreshUsers(true); 
      onClose(); 
    } else {
      alert("Error assigning user.");
    }
  };

  if (loading) {
    return <div>Loading team details...</div>; 
  }

  return (
    <div className="fixed inset-0 bg-opacity-50 bg-gray-800 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Assign User</h2>

        {teamUsers.length > 0 ? (
          <ul className="space-y-2">
            {teamUsers.map((user) => (
              <li key={user.id} className="p-2 cursor-pointer rounded-lg hover:bg-gray-200">
                <div
                  onClick={() => handleAssignUser(user.id)} 
                  className="flex items-center justify-between"
                >
                  <span>
                    {user.first_name} {user.last_name}
                  </span>
                  <Button variant="outline">Assign</Button> 
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No users available to assign</p>
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
