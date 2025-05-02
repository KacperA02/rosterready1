import { FC } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useRoles } from "@/hooks/useRoles";
import {
	Calendar,
	Home,
	Inbox,
	Users,
	ChevronDown,
	ChevronUp,
	UserCircle,
} from "lucide-react";
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
	SidebarMenuSub,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from "@/components/ui/collapsible"; 

const AppSidebar: FC = () => {
	const { user } = useAuth();
	const { totalInboxCount } = useInboxCount();
	const { isAdmin, isEmployer } = useRoles();

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
		},
	];

	return (
		<Sidebar className="w-64">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>RosterReady</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{/* Top-level links */}
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

							{/* Teams Section */}
							<Collapsible defaultOpen className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton>
											<div className="flex items-center space-x-2">
												<Users />
												<span>My Team</span>
												<ChevronDown className="ml-auto group-data-[state=open]/collapsible:hidden" />
												<ChevronUp className="ml-auto hidden group-data-[state=open]/collapsible:block" />
											</div>
										</SidebarMenuButton>
									</CollapsibleTrigger>

									<CollapsibleContent className="py-2">
										<SidebarMenuSub>
											<SidebarMenuSubItem>
												<Link className="text-xs"  to="/teams">Overview</Link>
											</SidebarMenuSubItem>

											{(isEmployer() || isAdmin()) && (
												<>
													<SidebarMenuSubItem>
														<Link className="text-xs"  to="/teams/shifts">Shifts</Link>
													</SidebarMenuSubItem>
													<SidebarMenuSubItem >
														<Link className="text-xs" to="/employees">Employees</Link>
													</SidebarMenuSubItem>
													<SidebarMenuSubItem>
														<Link className="text-xs"  to="/teams/skills">Skills</Link>
													</SidebarMenuSubItem>
												
													<SidebarMenuSubItem>
														<Link className="text-xs"  to="/teamAvailabilities">
															Team Availabilities
														</Link>
													</SidebarMenuSubItem>
												</>
											)}
										</SidebarMenuSub>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>

							{/* Account Section */}
							<Collapsible className="group/collapsible">
								<SidebarMenuItem>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton>
											<div className="flex items-center space-x-2">
												<UserCircle />
												<span>Account</span>
												<ChevronDown className="ml-auto group-data-[state=open]/collapsible:hidden" />
												<ChevronUp className="ml-auto hidden group-data-[state=open]/collapsible:block" />
											</div>
										</SidebarMenuButton>
									</CollapsibleTrigger>

									<CollapsibleContent>
										<div className="px-4 py-2 text-xs text-muted-foreground font-semibold">
											{user?.sub || "email@example.com"}
										</div>
										<SidebarMenuSub>
											<SidebarMenuSubItem>
												<Link className="text-xs"  to="/myDetails">Details</Link>
											</SidebarMenuSubItem>
											<SidebarMenuSubItem>
												<Link className="text-xs"  to="/myAvailability">My Availability</Link>
											</SidebarMenuSubItem>
										</SidebarMenuSub>
										<div className="px-4 py-2">
											<LogoutButton />
										</div>
									</CollapsibleContent>
								</SidebarMenuItem>
							</Collapsible>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default AppSidebar;
