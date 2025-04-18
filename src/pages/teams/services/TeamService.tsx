import instance from "@/config/Api"; // Axios instance
import { TeamCreate, TeamResponse, TeamUsersResponse } from "@/types/team";

// Create a new team
export const createTeam = async (teamData: TeamCreate): Promise<TeamResponse | null> => {
  try {
    const response = await instance.post("/teams", teamData);
    return response.data; // Ensure it matches the expected response format
  } catch (error) {
    console.error("Error creating team:", error);
    return null;
  }
};
export const fetchTeamDetails = async (teamId: number): Promise<TeamResponse | null> => {
  try {
    const response = await instance.get(`/teams/${teamId}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching team details:", error);
    return null;
  }
};
export const fetchTeamUsers = async (teamId: number): Promise<TeamUsersResponse | null> => {
  try {
    const response = await instance.get(`/teams/${teamId}/users`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching team users:", error);
    return null;
  }
};
// inviting a user to a team
// This function sends an invitation to a user to join a team using their email or phone number
export const inviteUserToTeam = async (identifier: string): Promise<boolean> => {
  try {
    await instance.post(
      `/invitation/invite`,
      { identifier }, 
      { withCredentials: true }
    );
    return true;
  } catch (error) {
    console.error("Error inviting user:", error);
    const errorMessage = (error as any)?.response?.data?.detail 
    throw new Error(errorMessage);
  }
};
// export const fetchPendingInvitationsForTeam = async (): Promise<TeamInvitationResponse[] | null> => {
//   try {
//     const response = await instance.get(`/invitation/team`, { withCredentials: true });
//     return response.data;  // Assuming this returns an array of TeamInvitationResponse
//   } catch (error) {
//     console.error("Error fetching pending invitations for team:", error);
//     return null;
//   }
// };