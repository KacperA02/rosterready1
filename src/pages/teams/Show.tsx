import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRoles } from "@/hooks/useRoles";
import { fetchTeamDetails, updateTeamName, deleteTeam } from "./services/TeamService";
import { TeamResponse } from "@/types/team";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import WhatToDoSection from "./components/WhatToDoSec";
import EmployeeWhatToDoSection from "./components/EmployeeWhatToDoSec";
import Cookies from "js-cookie";


const TeamDetails = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { isAdmin, isEmployer, isEmployee } = useRoles();
	const [team, setTeam] = useState<TeamResponse | null>(null);
	const [error, setError] = useState<string>("");
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false); 
	const [newTeamName, setNewTeamName] = useState<string>("");

	useEffect(() => {
		const loadTeam = async () => {
			if (user?.team_id) {
				const fetchedTeam = await fetchTeamDetails(user.team_id);
				if (fetchedTeam) {
					setTeam(fetchedTeam);
				} else {
					setError("Error fetching team details");
				}
			} else {
				navigate("/no-team");
			}
		};

		loadTeam();
	}, [user, navigate]);

	// dialogs
	const handleUpdateTeamName = async () => {
		if (!team) return;
		setNewTeamName(team.name);
		setIsUpdateDialogOpen(true);
	};

	const handleDeleteTeam = async () => {
		if (!team) return;
		setIsDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!team) return;

		const success = await deleteTeam(team.id);
		if (success) {
			Cookies.remove("access_token");
			navigate("/login");
			window.location.reload();
			navigate("/");
		} else {
			alert("Failed to delete team.");
		}

		setIsDeleteDialogOpen(false); 
	};

	const handleUpdateTeamNameSubmit = async () => {
		if (!team || !newTeamName.trim()) return;
		
		const updatedTeam = await updateTeamName(team.id, { name: newTeamName });
		
		if (updatedTeam) {
			setTeam(updatedTeam);
		} else {
			alert("Failed to update team name.");
		}
		setIsUpdateDialogOpen(false); 
	};

	if (error) {
		return <div className="text-red-500">{error}</div>;
	}

	if (!team) {
		return <div>Loading...</div>;
	}

	return (
		<div className="team-details p-4">
			<Card className="w-full shadow-lg rounded-2xl">
				<CardContent className="p-6">
					<div className="space-y-6">
						<div>
							<h1 className="text-2xl font-bold">{team.name}</h1>
							{isEmployee() && !isAdmin() && !isEmployer() && (
								<p className="text-gray-600 mt-1">You are an employee.</p>
							)}
							{(isAdmin() || isEmployer()) && (
								<p className="text-gray-600 mt-1">You are the employer.</p>
							)}
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div>
								<p className="text-sm text-muted-foreground">Employees</p>
								<p className="text-lg font-medium">{team.employee_count}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Shifts</p>
								<p className="text-lg font-medium">{team.shift_count}</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground">Expertises</p>
								<p className="text-lg font-medium">{team.expertise_count}</p>
							</div>
						</div>

						{isEmployee() && !isAdmin() && !isEmployer() && (
							<Button variant="outline" className="w-full">
								Leave Team
							</Button>
						)}

						{(isAdmin() || isEmployer()) && (
							<div className="flex flex-col sm:flex-row gap-4 flex-wrap">
								<Button
									className="w-full sm:w-auto sm:flex-1 text-black"
									onClick={handleUpdateTeamName}
								>
									Change Team Name
								</Button>
								<Button
									variant="destructive"
									className="w-full text-black sm:w-auto sm:flex-1"
									onClick={handleDeleteTeam}
								>
									Delete Team
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
			{isEmployer() && <WhatToDoSection />}
			{isEmployee() && <EmployeeWhatToDoSection />}

			{/* Update Team Name Dialog */}
			<Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
				<DialogContent className="bg-white">
					<h3 className="text-xl font-semibold">Update Team Name</h3>
					<input
						type="text"
						value={newTeamName}
						onChange={(e) => setNewTeamName(e.target.value)}
						placeholder="Enter new team name"
						className="w-full p-2 mt-2 border rounded-md"
					/>
					<DialogFooter>
						<Button onClick={handleUpdateTeamNameSubmit}>Update</Button>
						<Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Team Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="bg-white">
					<h3 className="text-xl font-semibold">Are you sure you want to delete this team?</h3>
					<DialogFooter>
						<Button variant="destructive" onClick={confirmDelete}>
							Delete
						</Button>
						<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default TeamDetails;
