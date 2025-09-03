import { Group } from "@/app/types/api";
import { useAuth } from "./useAuth";

export function useGroup() {
  const { getToken } = useAuth();

  const create = async (
    name: string,
    description: string,
    type: string,
    members?: any[]
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, description, type, members }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  };

  const getById = async (id: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch group");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching group:", error);
      throw error;
    }
  };

  const updateGroup = async (id: string, updates: Partial<Group>) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update group");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  };

  const addMembers = async (groupId: string, members: any[]) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups/${groupId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ members }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add members");
      }

      return await response.json();
    } catch (error) {
      console.error("Error adding members:", error);
      throw error;
    }
  };

  const updateMember = async (
    groupId: string,
    memberId: string,
    memberData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      roleId: string;
    }
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups/${groupId}/members/${memberId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(memberData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update member");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating member:", error);
      throw error;
    }
  };

  const getTypes = async () => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/groups-types`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch group types");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching group types:", error);
      throw error;
    }
  };

  return {
    create,
    getAll,
    getById,
    updateGroup,
    addMembers,
    updateMember,
    getTypes,
  };
}
