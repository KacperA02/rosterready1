import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRoles } from "@/hooks/useRoles";
import { fetchTeamDetails, updateTeamName, deleteTeam } from "./services/TeamService";
import { TeamResponse } from "@/types/team";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import WhatToDoSection from "./components/WhatToDoSec";
import EmployeeWhatToDoSection from "./components/EmployeeWhatToDoSec";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";

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
							<h1 className="text-4xl font-bold">{team.name}</h1>
							{isEmployee() && !isAdmin() && !isEmployer() && (
								<p className="text-gray-600 mt-1">You are an Employee.</p>
							)}
							{(isAdmin() || isEmployer()) && (
								<p className="text-gray-600 mt-1">You are the Employer.</p>
							)}
						</div>

						{/* Evenly spaced stats */}
						{(isAdmin() || isEmployer()) && (
	<div className="flex items-center justify-between mt-8 flex-wrap gap-4">
		<div className="flex space-x-6">
			<div>
				<p className="text-sm text-muted-foreground">Employees</p>
				<p className="text-lg font-medium">{team.employee_count}</p>
			</div>
			<div>
				<p className="text-sm text-muted-foreground">Shifts</p>
				<p className="text-lg font-medium">{team.shift_count}</p>
			</div>
			<div>
				<p className="text-sm text-muted-foreground">Skills</p>
				<p className="text-lg font-medium">{team.expertise_count}</p>
			</div>
		</div>

		<div className="flex space-x-4 ml-auto">
			<Button className="text-black" onClick={handleUpdateTeamName}>
				Change Team Name
			</Button>
			<Button variant="destructive" className="text-black" onClick={handleDeleteTeam}>
				Delete Team
			</Button>
		</div>
	</div>
)}
						{/* Leave team button for employees */}
						{isEmployee() && !isAdmin() && !isEmployer() && (
							<div className="flex justify-end mt-8 space-x-4">
								<Button variant="outline">Leave Team</Button>
							</div>
						)}
					
					</div>
				</CardContent>
				{isEmployer() && <WhatToDoSection />}
				{isEmployee() && <EmployeeWhatToDoSection />}
			</Card>

			{/* Update Team Name Dialog */}
			<Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
				<DialogContent >
					<h3 className="text-xl font-semibold">Update Team Name</h3>
					<Input
						type="text"
						value={newTeamName}
						onChange={(e) => setNewTeamName(e.target.value)}
						placeholder="Enter new team name"
						className="w-full p-2 mt-2 border rounded-md"
					/>
					<DialogFooter>
						<Button variant={"default"} onClick={handleUpdateTeamNameSubmit}>Update</Button>
						<Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Team Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <DialogContent className="bg-white">
    <DialogTitle>Delete Team</DialogTitle>
    <DialogDescription className="text-sm text-gray-600 mt-2">
      Deleting this team will remove all associated data and cannot be undone. Are you sure you want to proceed?
    </DialogDescription>

    <DialogFooter >
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
