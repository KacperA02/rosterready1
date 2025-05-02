import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TeamUser } from "@/types/team";
import { useAuth } from "@/contexts/AuthContext";
import { removeUserFromTeam } from "../services/TeamService";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogCancel,
	AlertDialogAction,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
	users: TeamUser[];
	onUpdate: () => void;
}

const EmployeeComp = ({ users, onUpdate }: Props) => {
	const [search, setSearch] = useState("");
	const { user } = useAuth();
	const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const filteredUsers = users.filter(
		(userItem) =>
			userItem.email !== user?.sub &&
			[
				userItem.first_name,
				userItem.last_name,
				userItem.email,
				userItem.mobile_number,
			].some((field) => field?.toLowerCase().includes(search.toLowerCase()))
	);

	const handleRemove = async () => {
		if (!user?.team_id || !selectedUser) return;
		const success = await removeUserFromTeam(user.team_id, selectedUser.id);
		if (success) {
			onUpdate();
		}
		setIsDialogOpen(false);
		setSelectedUser(null);
	};

	return (
		<div className="space-y-6">
			<Input
				placeholder="Search by name, email or mobile number"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				className="max-w-md mx-auto"
			/>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				{filteredUsers.map((user) => (
					<Card key={user.id} className="rounded-2xl shadow-md">
						<CardContent className="p-6 space-y-4">
							<h2 className="text-xl font-semibold">
								{user.first_name} {user.last_name}
							</h2>
							<div>
								<h4 className="font-medium text-muted-foreground mb-1">
									Contact
								</h4>
								<Separator className="mb-2" />
								<p className="text-sm text-muted-foreground">Email Address:  {user.email}</p>
								<p className="text-sm text-muted-foreground">
									Phone Number: {user.mobile_number}
								</p>
							</div>
							<AlertDialog
								open={isDialogOpen && selectedUser?.id === user.id}
								onOpenChange={setIsDialogOpen}
							>
								<AlertDialogTrigger asChild>
									<Button
										variant="destructive"
										onClick={() => {
											setSelectedUser(user);
											setIsDialogOpen(true);
										}}
									>
										Remove
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent className="">
									<AlertDialogHeader>
										<AlertDialogTitle>
											Remove {user.first_name} from team?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This will remove the user from the team, including all
											associations like shifts, expertises, and availabilities.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction onClick={handleRemove}>
											Confirm
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};

export default EmployeeComp;
