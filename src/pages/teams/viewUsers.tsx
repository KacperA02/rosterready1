import { useEffect, useState } from "react";
import { TeamUser } from "@/types/team";
import {
	fetchTeamUsers,
	inviteUserToTeam,
	cancelTeamInvitation,
} from "./services/TeamService";
import EmployeeComp from "./components/EmployeeComp";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchTeamPendingInvitations } from "../Inbox/services/TeamReq";
import { TeamInvitation } from "@/types/team";
import { Card, CardContent } from "@/components/ui/card";
import { useGlobalRefresh } from "@/contexts/GlobalRefreshContext";

const ViewUsers = () => {
	const [users, setUsers] = useState<TeamUser[]>([]);
	const [search, setSearch] = useState("");
	const { user } = useAuth();
	const [inviteValue, setInviteValue] = useState("");
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState<{
		type: "success" | "error";
		message: string;
	} | null>(null);
	const { pageToRefresh, setPageToRefresh } = useGlobalRefresh();
	const [pendingInvites, setPendingInvites] = useState<TeamInvitation[]>([]);

	const loadUsers = async () => {
		if (!user?.team_id) return;

		try {
			const [teamRes, pendingInvitesRes] = await Promise.all([  
				fetchTeamUsers(user.team_id),
				fetchTeamPendingInvitations(),
			]);

			if (teamRes) {
				setUsers(teamRes.users);
			}

			setPendingInvites(pendingInvitesRes || []);
		} catch (error) {
			console.error("Error loading data:", error);
		}
	};

	useEffect(() => {
		loadUsers();
	}, [user]);

	useEffect(() => {
		if (pageToRefresh?.page === "invitations") {
			loadUsers();

			setTimeout(() => {
				setPageToRefresh(null);
			}, 50);
		}
	}, [pageToRefresh, setPageToRefresh]);

	// Filter the users based on search value
	const filteredUsers = users.filter(
		(userItem) =>
			[userItem.first_name, userItem.last_name, userItem.email, userItem.mobile_number].some((field) =>
				field?.toLowerCase().includes(search.toLowerCase())
			)
	);

	const handleInvite = async () => {
		if (!inviteValue) return;

		try {
			const success = await inviteUserToTeam(inviteValue);
			if (success) {
				setAlert({
					type: "success",
					message: "Invitation sent!",
				});
				setInviteValue("");
				setOpen(false);
				loadUsers();

				setTimeout(() => setAlert(null), 5000);
			} else {
				setAlert({
					type: "error",
					message: "Failed to send invitation. Possible Invalid email or phone number.",
				});
				setTimeout(() => setAlert(null), 5000);
			}
		} catch (error: any) {
			const errorMessage =
				error.response?.data?.detail || "Something went wrong. Please try again.";
			setAlert({
				type: "error",
				message: errorMessage,
			});
			setTimeout(() => setAlert(null), 5000);
		}
	};

	return (
		<div className="pb-6">
			<h1 className="text-4xl font-bold pb-4">Employees</h1>

			<div className="flex justify-between items-center mb-6">
				<Input
					placeholder="Search by name, email or mobile number"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="max-w-md"
				/>
				<Sheet open={open} onOpenChange={setOpen}>
					<SheetTrigger asChild>
						<Button className="mb-4 text-black">Invite New Employee</Button>
					</SheetTrigger>

					<SheetContent side="right">
						<SheetHeader>
							<SheetTitle className="text-xl mt-2">Invite Employee to Team</SheetTitle>
						</SheetHeader>

						<div className="space-y-4 px-4">
							{/* Input for email or mobile number */}
							<Input
								type="text"
								placeholder="Email or Mobile Number"
								value={inviteValue}
								onChange={(e) => setInviteValue(e.target.value)}
							/>
							{/* Invite Button */}
							<Button onClick={handleInvite} className="w-full">
								Send Invite
							</Button>
						</div>
					</SheetContent>
				</Sheet>
			</div>

			{/* Display Alerts */}
			{alert && (
				<Alert variant={alert.type === "success" ? "default" : "destructive"}>
					<AlertTitle>{alert.type === "success" ? "Success!" : "Error!"}</AlertTitle>
					<AlertDescription>{alert.message}</AlertDescription>
				</Alert>
			)}

			{/* Display Employee Cards */}
			<EmployeeComp users={filteredUsers} onUpdate={loadUsers} />

			{pendingInvites.length > 0 && (
				<div className="mt-10 space-y-6">
					<h2 className="text-2xl font-semibold">Sent Invitations</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
						{pendingInvites.map((invitation) => (
							<Card key={invitation.id} className="bg-muted rounded-2xl shadow-inner">
								<CardContent className="p-6 space-y-4">
									<h3 className="text-lg font-medium text-center">
										{invitation.user?.first_name} {invitation.user?.last_name}
									</h3>
									<Separator className="border" />
									<div className="flex items-center justify-between">
										<p className="text-sm text-muted-foreground italic">
											{invitation.user?.email}
										</p>
										<Button
											variant="destructive"
											onClick={async () => {
												const success = await cancelTeamInvitation(invitation.id);
												if (success) {
													setAlert({
														type: "success",
														message: "Invitation cancelled successfully.",
													});
													loadUsers();
												} else {
													setAlert({
														type: "error",
														message: "Failed to cancel invitation.",
													});
												}
												setTimeout(() => setAlert(null), 5000);
											}}
										>
											Cancel Request
										</Button>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default ViewUsers;
