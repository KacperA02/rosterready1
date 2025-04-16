import { useEffect, useState } from "react";
import { fetchPendingInvitations } from "./services/TeamReq";
import { fetchTeamAvailabilities } from "./services/AvailbilityReq";
import { useRoles } from "@/hooks/useRoles";
import { TeamInvitation } from "@/types/team";
import { UserAvailability } from "@/types/availability";
import TeamComp from "./components/TeamComp";
import AvailableComp from "./components/AvailableComp";
import { useGlobalRefresh } from "@/contexts/GlobalRefreshContext";
export default function InboxPage() {
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [availabilities, setAvailabilities] = useState<UserAvailability[]>([]);
  const { isEmployer } = useRoles();
  const { pageToRefresh, setPageToRefresh } = useGlobalRefresh();
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invites, teamAvails] = await Promise.all([fetchPendingInvitations(), fetchTeamAvailabilities()]);

        setInvitations(invites);
        setAvailabilities(teamAvails.filter((avail) => !avail.approved));
        
      } catch (err) {
        console.error("Error fetching inbox data", err);
      }
    };
    
    fetchData();
  }, []);
  useEffect(() => {
    // If the `pageToRefresh` is notifications, re-fetch the data.
    if (pageToRefresh?.page === 'notifications') {
      console.log('Refreshing notifications...');
      const fetchData = async () => {
        try {
          const [invites, teamAvails] = await Promise.all([fetchPendingInvitations(), fetchTeamAvailabilities()]);

          setInvitations(invites);
          setAvailabilities(teamAvails.filter((avail) => !avail.approved));
          
          
        } catch (err) {
          console.error("Error fetching inbox data", err);
        }
      };

      fetchData();
      setTimeout(() => {
        setPageToRefresh({ page: 'invitations', key: Date.now() });
      }, 50);
      // Reset refresh state after refreshing
    }
  }, [pageToRefresh, setPageToRefresh]);
  const handleAvailabilityApprovalToggle = (id: number) => {
    setAvailabilities((prev) => prev.filter((avail) => avail.id !== id)); // Remove the approved availability
  };
 
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Inbox</h1>

      {/* Team Invitations Section */}
      
      <section>
        <h2 className="text-xl font-semibold mb-2">Team Invitations</h2>
        {invitations.length === 0 ? (
          <p className="text-muted-foreground">No pending invitations.</p>
        ) : (
          <div className="space-y-3">
            {invitations.map((invite) => (
              <TeamComp key={invite.id} invitation={invite} setInvitations={setInvitations} />
            ))}
          </div>
        )}
      </section>

      {/* Availabilities Section */}
      {isEmployer() && (
        <section>
          <h2 className="text-xl font-semibold mb-2">New Availabilities</h2>
          {availabilities.length === 0 ? (
            <p className="text-muted-foreground">No New Availability Requests.</p>
          ) : (
            <div className="space-y-3">
              {availabilities.map((avail) => (
                <AvailableComp
                  key={avail.id}
                  availability={avail}
                  onApprovalToggle={handleAvailabilityApprovalToggle}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
