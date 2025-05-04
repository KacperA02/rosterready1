import instance from "@/config/Api"; 
import { ShiftCreate, ShiftResponse, ShiftDaysCreate } from "@/types/shift";

// Fetched all shifts for the team
export const fetchShifts = async (): Promise<ShiftResponse[]> => {
  try {
    const response = await instance.get("/shifts/");
    return response.data;  
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return [];
  }
};

// Fetched a specific shift by its ID
export const fetchShiftById = async (shiftId: number): Promise<ShiftResponse | null> => {
  try {
    const response = await instance.get(`/shifts/specific/${shiftId}`);
     // Ensured this matched the response structure for a single shift
    return response.data; 
  } catch (error) {
    console.error("Error fetching shift:", error);
    return null;
  }
};

// Created a new shift
export const createShift = async (shiftData: ShiftCreate): Promise<ShiftResponse | null> => {
  try {
    const response = await instance.post("/shifts/", shiftData);
      // Ensured this matched the expected response after creating a shift
    return response.data;
  } catch (error) {
    console.error("Error creating shift:", error);
    return null;
  }
};

// Updated an existing shift
export const updateShift = async (shiftId: number, shiftData: ShiftCreate): Promise<ShiftResponse | null> => {
  try {
    const response = await instance.put(`/shifts/specific/${shiftId}`, shiftData);
    // Ensured this matched the expected response after updating a shift
    return response.data;  
  } catch (error) {
    console.error("Error updating shift:", error);
    return null;
  }
};

// Attached days to a shift
export const attachDaysToShift = async (shiftId: number, shiftDays: ShiftDaysCreate): Promise<any> => {
  try {
    const response = await instance.post(`/shifts/days/${shiftId}`, shiftDays);
    return response.data;  
  } catch (error) {
    console.error("Error attaching days to shift:", error);
    throw error;  
  }
};

// Removed days from a shift
export const removeDaysFromShift = async (shiftId: number, shiftDays: ShiftDaysCreate): Promise<any> => {
  try {
    const response = await instance.delete(`/shifts/days/${shiftId}`, { data: shiftDays });
    return response.data; 
  } catch (error) {
    console.error("Error removing days from shift:", error);
    throw error;  
  }
};

export const deleteShift = async (shiftId: number): Promise<boolean> => {
  try {
    await instance.delete(`/shifts/specific/${shiftId}`);
    return true;
  } catch (error) {
    console.error("Error deleting shift:", error);
    return false;
  }
};