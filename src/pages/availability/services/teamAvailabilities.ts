import instance from "@/config/Api";
import { UserAvailability } from "@/types/availability"; 

// GET: Fetch all team availabilities (Employer only)
export const fetchTeamAvailabilities = async (): Promise<UserAvailability[]> => {
  try {
    const response = await instance.get("/available/team");
    return response.data;
  } catch (error) {
    console.error("Error fetching team availabilities:", error);
    return [];
  }
};

// PATCH: Toggle approval for a specific availability
export const toggleApproval = async (availabilityId: number): Promise<UserAvailability | null> => {
  try {
    const response = await instance.patch(`/available/specific/${availabilityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error toggling approval for availability ${availabilityId}:`, error);
    return null;
  }
};
