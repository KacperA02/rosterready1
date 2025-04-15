// services/TeamReq.ts
import instance from "@/config/Api";
import { TeamInvitation } from "@/types/team";

export const sendTeamInvitation = async (userId: number): Promise<TeamInvitation | null> => {
  try {
    const response = await instance.post(`/invitation/invite/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error sending invitation:", error);
    return null;
  }
};

export const acceptInvitation = async (invitationId: number): Promise<TeamInvitation | null> => {
  try {
    const response = await instance.post(`/invitation/accept/${invitationId}`);
    return response.data;
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return null;
  }
};

export const rejectInvitation = async (invitationId: number): Promise<TeamInvitation | null> => {
  try {
    const response = await instance.post(`/invitation/reject/${invitationId}`);
    return response.data;
  } catch (error) {
    console.error("Error rejecting invitation:", error);
    return null;
  }
};

export const fetchPendingInvitations = async (): Promise<TeamInvitation[]> => {
  try {
    const response = await instance.get(`/invitation`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending invitations:", error);
    return [];
  }
};
