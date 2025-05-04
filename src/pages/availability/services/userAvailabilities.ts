import instance from "@/config/Api";
import { UserAvailability, AvailabilityCreate } from "@/types/availability"; 

// GET: Fetch the current user's availabilities
export const fetchUserAvailabilities = async (): Promise<UserAvailability[]> => {
  try {
    const response = await instance.get("/available/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user availabilities:", error);
    return [];
  }
};

// DELETE: Delete a specific availability by ID
export const deleteUserAvailability = async (availabilityId: number): Promise<boolean> => {
  try {
    await instance.delete(`/available/specific/${availabilityId}`);
    return true;
  } catch (error) {
    console.error(`Error deleting availability ${availabilityId}:`, error);
    return false;
  }
};

// POST: Create a new user availability
export const createUserAvailability = async (
    availabilityData: AvailabilityCreate
  ): Promise<UserAvailability | null> => {
    try {
      console.log("Sending availability data:", availabilityData); 
  
      const response = await instance.post("/available/", availabilityData);
      return response.data;
    } catch (error) {
      console.error("Error creating availability:", error);
      return null;
    }
  };
  
