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
export const createSchedule = async (teamId: number, weekId: number): Promise<boolean> => {
  try {
    const response = await instance.post(`/schedule/assign-shifts/${teamId}/${weekId}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error creating schedule:", error);
    return false;
  }
};

export const fetchWeekByStartDate = async (startDate: string) => {
  try {
    const response = await instance.get(`/weeks/search/`, {
      params: { start_date: startDate }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching week by date:", error);
    return null;
  }
};

export const acceptSolution = async (solutionId: number): Promise<boolean> => {
  try {
    const response = await instance.post(`/solutions/accept/${solutionId}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error accepting solution:", error);
    return false;
  }
};

export const declineSolution = async (solutionId: number): Promise<boolean> => {
  try {
    const response = await instance.delete(`/solutions/decline/${solutionId}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error declining solution:", error);
    return false;
  }
};
