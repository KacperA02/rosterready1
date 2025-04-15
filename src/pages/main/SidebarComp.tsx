import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Calendar, Home, Inbox, Users, ChevronDown, ChevronUp, UserCircle } from "lucide-react"; 
import LogoutButton from "@/components/buttons/logoutBtn";
import { useInboxCount } from "@/contexts/InboxCountContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const AppSidebar: FC = () => {
  const { user } = useAuth();
  const { totalInboxCount } = useInboxCount();
  const [teamsExpanded, setTeamsExpanded] = useState(false);
  const [accountExpaned, setAccountExpaned] = useState(false);

  const toggleTeams = () => setTeamsExpanded((prev) => !prev);
  const toggleAccount = () => setAccountExpaned((prev) => !prev);

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: Inbox,
      unreadCount: totalInboxCount,  
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    }
  ];

  return (
    <Sidebar className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>RosterReady</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center space-x-2">
                      <item.icon />
                      <span>{item.title}</span>
                      {item.unreadCount && item.unreadCount > 0 && (
                        <span className="ml-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                          {item.unreadCount}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={toggleTeams}>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <Users />
                    <span>Teams</span>
                    {teamsExpanded ? (
                      <ChevronUp className="ml-auto" />
                    ) : (
                      <ChevronDown className="ml-auto" />
                    )}
                  </div>
                </SidebarMenuButton>

                {teamsExpanded && (
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/teams" className="flex items-center space-x-2">
                            <span>Overview</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/employees" className="flex items-center space-x-2">
                            <span>Employees</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/teams/expertise" className="flex items-center space-x-2">
                            <span>Expertise</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/teams/shifts" className="flex items-center space-x-2">
                            <span>Shifts</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/teamAvailabilities" className="flex items-center space-x-2">
                            <span>Team Availabilities</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                )}
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild onClick={toggleAccount}>
                  <div className="flex items-center space-x-2 cursor-pointer">
                    <UserCircle />
                    <span>Account</span>
                    {accountExpaned ? (
                      <ChevronUp className="ml-auto" />
                    ) : (
                      <ChevronDown className="ml-auto" />
                    )}
                  </div>
                </SidebarMenuButton>

                {accountExpaned && (
                  <SidebarGroupContent>
                    <div className="px-4 py-2 text-xs text-muted-foreground">
                      {user?.sub || "email@example.com"}
                    </div>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/myDetails" className="flex items-center space-x-2">
                            <span>Details</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link to="/myAvailability" className="flex items-center space-x-2">
                            <span>My Availability</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                    <div className="px-4 py-2">
                      <LogoutButton />
                    </div>
                  </SidebarGroupContent>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
