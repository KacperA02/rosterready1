import instance from "@/config/Api";
import { Solution, SolutionAssignment } from "@/types/solution";

export const fetchAllSolutions = async (): Promise<Solution[]> => {
  try {
    const response = await instance.get("/solutions");
    return response.data;
  } catch (error) {
    console.error("Error fetching all solutions:", error);
    return [];
  }
};

export const fetchSingleSolution = async (
  solutionId: number
): Promise<SolutionAssignment[] | null> => {
  try {
    const response = await instance.get(`/assignments/single/${solutionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching single solution:", error);
    return null;
  }
};

