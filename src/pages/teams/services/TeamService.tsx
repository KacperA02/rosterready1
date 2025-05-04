import instance from "@/config/Api"; // Axios instance
import {
	TeamCreate,
	TeamResponse,
	TeamUsersResponse,
	IUsers,
} from "@/types/team";

// Create a new team
export const createTeam = async (
	teamData: TeamCreate
): Promise<TeamResponse | null> => {
	try {
		const response = await instance.post("/teams/", teamData);
		return response.data; // Ensure it matches the expected response format
	} catch (error) {
		console.error("Error creating team:", error);
		return null;
	}
};
export const fetchTeamDetails = async (
	teamId: number
): Promise<TeamResponse | null> => {
	try {
		const response = await instance.get(`/teams/${teamId}`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching team details:", error);
		return null;
	}
};
export const fetchTeamUsers = async (
	teamId: number
): Promise<TeamUsersResponse | null> => {
	try {
		const response = await instance.get(`/teams/${teamId}/users`, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching team users:", error);
		return null;
	}
};
// inviting a user to a team
// This function sends an invitation to a user to join a team using their email or phone number
export const inviteUserToTeam = async (
	identifier: string
): Promise<boolean> => {
	try {
		await instance.post(
			`/invitation/invite`,
			{ identifier },
			{ withCredentials: true }
		);
		return true;
	} catch (error) {
		console.error("Error inviting user:", error);
		const errorMessage = (error as any)?.response?.data?.detail;
		throw new Error(errorMessage);
	}
};

export const updateTeamName = async (
	teamId: number,
	teamData: TeamCreate
): Promise<TeamResponse | null> => {
	try {
		const response = await instance.put(`/teams/${teamId}/edit`, teamData, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error("Error updating team name:", error);
		return null;
	}
};

export const deleteTeam = async (teamId: number): Promise<boolean> => {
	try {
		await instance.delete(`/teams/${teamId}`, { withCredentials: true });
		return true;
	} catch (error) {
		console.error("Error deleting team:", error);
		return false;
	}
};

export const removeUserFromTeam = async (
	teamId: number,
	userId: number
): Promise<boolean> => {
	try {
		await instance.delete(`/teams/${teamId}/users/${userId}`, {
			withCredentials: true,
		});
		return true;
	} catch (error) {
		console.error("Error removing user from team:", error);
		return false;
	}
};

export const fetchCurrentUser = async (): Promise<IUsers | null> => {
	try {
		const response = await instance.get("/users/me", {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error("Error fetching current user info:", error);
		return null;
	}
};
export const cancelTeamInvitation = async (invitationId: number): Promise<boolean> => {
	try {
		await instance.delete(`/invitation/cancel/${invitationId}`, {
			withCredentials: true,
		});
		return true;
	} catch (error) {
		console.error("Error cancelling invitation:", error);
		return false;
	}
};

export const editCurrentUser = async (
	updatedUser: Partial<IUsers>
): Promise<IUsers | null> => {
	try {
		const response = await instance.put("/users/me", updatedUser, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		console.error("Error updating user:", error);
		return null;
	}
};

export const deleteCurrentUser = async (): Promise<boolean> => {
	try {
		await instance.delete("/users/me", {
			withCredentials: true,
		});
		return true;
	} catch (error) {
		console.error("Error deleting user:", error);
		return false;
	}
};