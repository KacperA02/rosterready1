// services/AvailabilityReq.ts
import instance from "@/config/Api";
import { UserAvailability } from "@/types/availability";

export const createAvailability = async (data: any): Promise<UserAvailability | null> => {
  try {
    const response = await instance.post("/available/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating availability:", error);
    return null;
  }
};

export const deleteAvailability = async (availabilityId: number): Promise<boolean> => {
  try {
    const response = await instance.delete(`/available/specific/${availabilityId}`);
    return response.status === 200;
  } catch (error) {
    console.error("Error deleting availability:", error);
    return false;
  }
};

export const fetchUserAvailabilities = async (): Promise<UserAvailability[]> => {
  try {
    const response = await instance.get("/available/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user availabilities:", error);
    return [];
  }
};

export const fetchTeamAvailabilities = async (): Promise<UserAvailability[]> => {
  try {
    const response = await instance.get("/available/team");
    return response.data;
  } catch (error) {
    console.error("Error fetching team availabilities:", error);
    return [];
  }
};

export const toggleAvailabilityApproval = async (availabilityId: number): Promise<UserAvailability | null> => {
  try {
    const response = await instance.patch(`/available/specific/${availabilityId}`);
    return response.data;
  } catch (error) {
    console.error("Error toggling approval:", error);
    return null;
  }
};

export const markAvailabilityViewed = async (availabilityId: number): Promise<UserAvailability | null> => {
  try {
    const response = await instance.patch(`/available/viewed/${availabilityId}`);
    return response.data;
  } catch (error) {
    console.error("Error marking availability as viewed:", error);
    return null;
  }
};
export const fetchTeamNotViewed = async (): Promise<UserAvailability[]> => {
  try {
    const response = await instance.get(`/available/teamInbox`);
    return response.data;
  } catch (error) {
    console.error("Error fetching team pending invitations:", error);
    return [];
  }
};

