import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NoTeam: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateTeam = () => {
    navigate("/teams/create");  // Navigate to the create team page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Uh oh, looks like you're not part of a team.</h1>
      <p className="text-lg mb-4">
        Ask your employer to invite you, remember to provide your email to them!
      </p>
      <p className="text-lg mb-4">
        Or, if you want to create a team, click the button below.
      </p>
      <Button onClick={handleCreateTeam}>Create Team</Button>
    </div>
  );
};

export default NoTeam;
