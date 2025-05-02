import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/expertise";
import { fetchTeamDetails } from "@/pages/teams/services/TeamService";
import {
	assignExpertiseToUser,
	removeExpertiseFromUser,
} from "../services/ExpertiseService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface UsersSheetProps {
	expertiseId: number;
	assignedUsers: IUser[];
	onClose: () => void;
	setRefreshUsers: React.Dispatch<React.SetStateAction<boolean>>;
	teamId: number;
}

export const AttachUserSheet: React.FC<UsersSheetProps> = ({
	expertiseId,
	assignedUsers,
	setRefreshUsers,
	teamId,
}) => {
	const [teamUsers, setTeamUsers] = useState<IUser[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [alertMessage, setAlertMessage] = useState<string | null>(null);
	const [alertError, setAlertError] = useState<boolean>(false);

	useEffect(() => {
		const loadTeamDetails = async () => {
			const teamDetails = await fetchTeamDetails(teamId);

			if (teamDetails) {
				setTeamUsers(teamDetails.user_ids);
			} else {
				setAlertMessage("Error fetching team details.");
				setAlertError(true);
			}
			setLoading(false);
		};

		loadTeamDetails();
	}, [teamId]);

	const handleToggleUserAssignment = async (
		user: IUser,
		isAssigned: boolean
	) => {
		let result = null;

		if (isAssigned) {
			result = await removeExpertiseFromUser(expertiseId, user.id);
			if (result) {
				setAlertMessage("User removed from expertise.");
				setAlertError(false);
			} else {
				setAlertMessage("Error removing user.");
				setAlertError(true);
			}
		} else {
			result = await assignExpertiseToUser(expertiseId, user.id);
			if (result) {
				setAlertMessage("User assigned successfully!");
				setAlertError(false);
			} else {
				setAlertMessage("Error assigning user.");
				setAlertError(true);
			}
		}

		if (result) {
			setRefreshUsers(true);
		}
	};

	if (loading) return <div>Loading team details...</div>;

	return (
		<div>
			<div className="bg-white p-6 ">
				<h2 className="text-xl font-semibold mb-4">Manage User Skill</h2>

				{alertMessage && (
					<Alert
						variant={alertError ? "destructive" : "default"}
						className="mb-4"
					>
						<AlertTitle>{alertError ? "Error" : "Success"}</AlertTitle>
						<AlertDescription>{alertMessage}</AlertDescription>
					</Alert>
				)}

				{teamUsers.length > 0 ? (
					<ul className="space-y-2 max-h-80 overflow-y-auto">
						{teamUsers.map((user) => {
							const isAssigned = assignedUsers.some((u) => u.id === user.id);

							return (
								<li
									key={user.id}
									className="p-2 cursor-pointer rounded-lg hover:bg-gray-200"
								>
									<div className="flex items-center justify-between">
										<span>
											{user.first_name} {user.last_name}
										</span>
										<Button
											variant={isAssigned ? "destructive" : "outline"}
											onClick={() =>
												handleToggleUserAssignment(user, isAssigned)
											}
										>
											{isAssigned ? "Remove" : "Assign"}
										</Button>
									</div>
								</li>
							);
						})}
					</ul>
				) : (
					<p className="text-gray-500">No users available</p>
				)}

			</div>
		</div>
	);
};
