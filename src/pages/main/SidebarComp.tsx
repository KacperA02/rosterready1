import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Calendar, Home, Inbox, Users, ChevronDown, ChevronUp } from "lucide-react"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "@/components/buttons/logoutBtn";
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
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  }
];

const AppSidebar: FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [teamsExpanded, setTeamsExpanded] = useState(false);

  const toggleTeams = () => setTeamsExpanded((prev) => !prev);

  return (
    <Sidebar className="w-64"> {/* Set fixed width for Sidebar */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>RosterReady</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Static Menu Items */}
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center space-x-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Teams Dropdown */}
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

                {/* Render dropdown items when expanded */}
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
                    </SidebarMenu>
                  </SidebarGroupContent>
                )}
              </SidebarMenuItem>
            </SidebarMenu>

            {/* User Info */}
            {isAuthenticated && (
              <div className="mt-6">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-500">Welcome, {user?.sub || "User"}</span>
                </div>

                <div className="mt-4">
                  <LogoutButton />
                </div>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
