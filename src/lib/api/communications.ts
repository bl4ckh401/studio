import { apiClient } from "./apiClient";

export interface CommunicationMessage {
  id: string;
  groupId: string;
  subject: string;
  message: string;
  createdById: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  recipients: {
    id: string;
    recipientType: "ALL" | "ROLE" | "USER";
    roleId?: string;
    role?: {
      id: string;
      name: string;
    };
    userId?: string;
    user?: {
      id: string;
      firstName: string;
      lastName: string;
    };
    isRead: boolean;
    readAt?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface CommunicationMessageResponse {
  communications: CommunicationMessage[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const communicationsApi = {
  getMessages: async (
    groupId: string,
    page: number = 1,
    limit: number = 10,
    { token }: { token: string }
  ): Promise<CommunicationMessageResponse> => {
    const response = await apiClient.rest.get<CommunicationMessageResponse>(
      `/communications/group/${groupId}?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  },

  getAdminMessages: async (
    page: number = 1,
    limit: number = 10,
    { token }: { token: string }
  ): Promise<CommunicationMessageResponse> => {
    if (!token) {
      throw new Error("Authentication token is required");
    }
    const response = await apiClient.rest.get<CommunicationMessageResponse>(
      `/communications?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  },

  sendMessage: async (
    data: {
      groupId: string;
      subject: string;
      message: string;
      recipients: {
        type: "ALL" | "ROLE" | "USER";
        roleId?: string;
        userId?: string;
      }[];
    },
    { token }: { token: string }
  ): Promise<CommunicationMessage> => {
    const response = await apiClient.rest.post<CommunicationMessage>(
      "/communications",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  },

  markAsRead: async (
    id: string,
    { token }: { token: string }
  ): Promise<void> => {
    await apiClient.rest.patch(`/communications/${id}/mark-read`, {});
  },
};
