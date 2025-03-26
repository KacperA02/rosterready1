import instance from "@/config/Api"; 
import { ExpertiseCreate, IExpertise, UserAttached, ShiftAttached } from "@/types/expertise";

// Fetch all expertise for the team
export const fetchAllExpertise = async (): Promise<IExpertise[]> => {
  try {
    const response = await instance.get("/expertise");
    return response.data;
  } catch (error) {
    console.error("Error fetching expertise:", error);
    return [];
  }
};

// Fetch a specific expertise by ID
export const fetchExpertiseById = async (expertiseId: number): Promise<IExpertise | null> => {
  try {
    const response = await instance.get(`/expertise/specific/${expertiseId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expertise:", error);
    return null;
  }
};

// Create a new expertise
export const createExpertise = async (expertiseData: ExpertiseCreate): Promise<IExpertise | null> => {
  try {
    const response = await instance.post("/expertise", expertiseData);
    return response.data;
  } catch (error) {
    console.error("Error creating expertise:", error);
    return null;
  }
};

// Update an existing expertise
export const updateExpertise = async (expertiseId: number, expertiseData: ExpertiseCreate): Promise<IExpertise | null> => {
  try {
    const response = await instance.put(`/expertise/specific/${expertiseId}`, expertiseData);
    return response.data;
  } catch (error) {
    console.error("Error updating expertise:", error);
    return null;
  }
};

// Delete an expertise
export const deleteExpertise = async (expertiseId: number): Promise<string | null> => {
  try {
    const response = await instance.delete(`/expertise/specific/${expertiseId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting expertise:", error);
    return null;
  }
};

// Assign expertise to a user
export const assignExpertiseToUser = async (expertiseId: number, userId: number): Promise<UserAttached | null> => {
  try {
    const response = await instance.post(`/expertise/assign/${expertiseId}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error assigning expertise to user:", error);
    return null;
  }
};

// Remove expertise from a user
export const removeExpertiseFromUser = async (expertiseId: number, userId: number): Promise<string | null> => {
  try {
    const response = await instance.delete(`/expertise/remove/${expertiseId}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing expertise from user:", error);
    return null;
  }
};

// Assign expertise to a shift
export const assignExpertiseToShift = async (expertiseId: number, shiftId: number): Promise<ShiftAttached | null> => {
  try {
    const response = await instance.post(`/expertise/assign/${expertiseId}/shift/${shiftId}`);
    return response.data;
  } catch (error) {
    console.error("Error assigning expertise to shift:", error);
    return null;
  }
};

// Remove expertise from a shift
export const removeExpertiseFromShift = async (expertiseId: number, shiftId: number): Promise<string | null> => {
  try {
    const response = await instance.delete(`/expertise/remove/${expertiseId}/shift/${shiftId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing expertise from shift:", error);
    return null;
  }
};
