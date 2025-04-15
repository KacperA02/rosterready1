import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TeamInvitation } from "@/types/team";
import { acceptInvitation, rejectInvitation } from "../services/TeamReq";
import Cookies from "js-cookie";
import { useInboxCount } from "@/contexts/InboxCountContext";  

interface TeamCompProps {
  invitation: TeamInvitation;
  setInvitations: React.Dispatch<React.SetStateAction<TeamInvitation[]>>;
}

const TeamComp: React.FC<TeamCompProps> = ({ invitation, setInvitations }) => {
  const { setTotalInboxCount } = useInboxCount(); 
  const navigate = useNavigate();

  const handleAccept = async (id: number) => {
    const result = await acceptInvitation(id);
    if (result) {
      setInvitations((prev) => prev.filter((invite) => invite.id !== id));
      setTotalInboxCount((prev) => prev - 1);  
    }
  };

  const handleReject = async (id: number) => {
    const result = await rejectInvitation(id);
    if (result) {
      setInvitations((prev) => prev.filter((invite) => invite.id !== id));
      setTotalInboxCount((prev) => prev - 1); 
    }
  };

  return (
    <Card className="w-full mx-auto shadow-lg">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="font-medium">Team #{invitation.team_id}</p>
          <p className="text-sm text-muted-foreground">
            Invited user: #{invitation.user_id} | Status: {invitation.status}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(invitation.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            className="text-black"
            variant="secondary"
            onClick={async () => {
              await handleAccept(invitation.id);
              Cookies.remove("access_token");
              navigate("/login");
              window.location.reload();
            }}
          >
            Accept
          </Button>
          <Button
            className="text-black"
            variant="destructive"
            onClick={() => handleReject(invitation.id)}
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamComp;
