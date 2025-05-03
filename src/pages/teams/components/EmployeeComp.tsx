import { useState } from "react";
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
	const { user } = useAuth();
	const [selectedUser, setSelectedUser] = useState<TeamUser | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				{users.map((user) => (
					<Card key={user.id} className="rounded-2xl shadow-md">
						<CardContent className="p-4 space-y-4">
							<h2 className="text-xl font-semibold text-center capitalize ">
								{user.first_name} {user.last_name}
							</h2>
							<Separator className="mb-4 border" />
							<div className="space-y-2">
								<div className="flex justify-between">
									<p className="text-sm text-muted-foreground">
										<b>Email Address: </b>
										{user.email}
									</p>
									<p className="text-sm text-muted-foreground">
										<b>Phone Number:</b> {user.mobile_number}
									</p>
								</div>
							</div>
							<AlertDialog
								open={isDialogOpen && selectedUser?.id === user.id}
								onOpenChange={setIsDialogOpen}
							>
								<AlertDialogTrigger asChild>
									<div className="justify-end flex mt-4">
										<Button
											variant="destructive"
											onClick={() => {
												setSelectedUser(user);
												setIsDialogOpen(true);
											}}
										>
											Remove
										</Button>
									</div>
								</AlertDialogTrigger>
								<AlertDialogContent className="bg-white">
									<AlertDialogHeader>
										<AlertDialogTitle>
											Remove {user.first_name} from team?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This will remove the user from the team, including all
											associations like shifts, skills, and availabilities.
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
