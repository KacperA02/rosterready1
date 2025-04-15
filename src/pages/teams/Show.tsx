import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRoles } from "@/hooks/useRoles";
import { fetchTeamDetails } from "./services/TeamService";
import { TeamResponse } from "@/types/team";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WhatToDoSection from "./components/WhatToDoSec";
import EmployeeWhatToDoSection from "./components/EmployeeWhatToDoSec";

const TeamDetails = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { isAdmin, isEmployer, isEmployee } = useRoles();
	const [team, setTeam] = useState<TeamResponse | null>(null);
	const [error, setError] = useState<string>("");

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
								<Button className="w-full sm:w-auto sm:flex-1 text-black">
									Change Team Name
								</Button>
								<Button
									variant="destructive"
									className="w-full text-black sm:w-auto sm:flex-1"
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
		</div>
	);
};

export default TeamDetails;
