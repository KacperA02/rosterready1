import { useEffect, useState } from "react";
import { TeamUsersResponse, TeamUser } from "@/types/team";
import { fetchTeamUsers } from "./services/TeamService";
import EmployeeComp from "./components/EmployeeComp";
import { useAuth } from "@/contexts/AuthContext";

const ViewUsers = () => {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadUsers = async () => {
      if (!user?.team_id) return;

      const res: TeamUsersResponse | null = await fetchTeamUsers(user.team_id);
      if (res) {
        setUsers(res.users);
      }
    };

    loadUsers();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Employees</h1>
      <EmployeeComp users={users} />
    </div>
  );
};

export default ViewUsers;
