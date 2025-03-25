import instance from "@/config/Api"; // Axios instance
import { TeamCreate, TeamResponse } from "@/types/team";

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
