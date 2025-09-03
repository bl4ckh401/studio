import { useState, useMemo } from "react";
import { Group, GroupPolicy } from "../app/types/api"; // Ensure this is correctly imported
import { useAuth } from "./useAuth";
import { endPoints } from "../lib/api/endpoints";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export function useGroup() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [policies, setPolicies] = useState<GroupPolicy[]>([]);
  const { getToken } = useAuth();
  const user = useAuthStore((state) => state.user);

  const create = async (
    name: string,
    description: string,
    type: string,
    members: Array<any> = []
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(endPoints.groups.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, type, members }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (errorData?.errors) {
          throw errorData.errors;
        }
        throw new Error("Error creating a group");
      }


      const newGroup = await response.json();
      setGroups((prev) => [...prev, newGroup.data]);
    } catch (error) {
      console.error("Create Group Error:", error);
    }
  };

  const getPolicies = async (groupId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(endPoints.groups.getPolicies(groupId), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch policies");
      }
      const data = await response.json();

      setPolicies(data.data);
    } catch (error) {
      setPolicies([]);
      console.error("Get Policies Error:", error);
      throw error;
    }
  };

  const getAll = async () => {
    try {
      const token = await getToken();
      const res = await fetch(endPoints.groups.getAll, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch groups");
      }
      const response = await res.json();
      setGroups(
        response.data?.filter((group: Group) => {
          // Check if user is a member of the group
          return group.members.some((member) => member.userId === user?.id);
        })
      );
      return response.data;
    } catch (error) {
      console.error("Get All Groups Error:", error);
      return [];
    }
  };

  const getTypes = async () => {
    try {
      const token = await getToken();
      const response = await fetch(endPoints.groups.types, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch group types");
      }
      return await response.json();
    } catch (error) {
      console.error("Get Types Error:", error);
      return [];
    }
  };

  const updateGroup = async (id: string, updates: Partial<Group>) => {
    try {
      const token = await getToken();
      const response = await fetch(`${endPoints.groups.update(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update group");
      }

      const updatedGroup = await response.json();
      setGroups((prev) =>
        prev.map((group) => (group.id === id ? updatedGroup : group))
      );

      toast.success(updatedGroup?.message);
    } catch (error) {
      console.error("Update Group Error:", error);
      toast.error("Error updating group");
    }
  };

  const getById = async (id: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${endPoints.groups.get(id)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update group");
      }

      const group = await response.json();
      return group;
    } catch (error) {
      console.error("Update Group Error:", error);
    }
  };

  const remove = async (id: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${endPoints.groups}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete group");
      }

      setGroups((prev) => prev.filter((group) => group.id !== id));
    } catch (error) {
      console.error("Delete Group Error:", error);
    }
  };

  const addSettings = async (groupId: string, body: any) => {
    try {
      const token = await getToken();
      const response = await fetch(endPoints.groups.settings(groupId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...body }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (errorData?.errors) {
          throw errorData.errors;
        }
        throw new Error("Error adding group settings");
      }

      toast.success("Successfully updated group settings");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Create Group Error:", error);
      toast.success("Error updating group settings");
      return `Error  creating group settings`;
    }
  };

  const getSettings = async (groupId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${endPoints.groups.settings(groupId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update group");
      }

      const settings = await response.json();
      return settings;
    } catch (error) {
      console.error("Update Group Error:", error);
    }
  };

  const addMembers = async (
    groupId: string,
    members: Array<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      roleId: string;
    }>
  ) => {
    try {
      const token = await getToken();
      
      // Get the current group to check existing members
      const currentGroup = await getById(groupId);
      
      // Check if the user has permission to add members
      const currentUser = currentGroup.data.members.find(m => m.userId === user?.id);
      const allowedRoles = ['CHAIRPERSON', 'SECRETARY', 'TREASURER'];
      
      // Only office bearers and the group creator can add members
      if (!currentUser || (!currentGroup.data.createdBy === user?.id && !allowedRoles.includes(currentUser.role.name))) {
        throw new Error("You don't have permission to add members");
      }

      // Check for duplicate emails on the server side
      const existingMembers = currentGroup.data.members || [];
      const existingEmails = existingMembers.map(member => member.user.email.toLowerCase().trim());
      
      const duplicateEmails = members.filter(member => 
        existingEmails.includes(member.email.toLowerCase().trim())
      );
      
      if (duplicateEmails.length > 0) {
        throw new Error(`These emails already exist in the group: ${duplicateEmails.map(m => m.email).join(', ')}`);
      }

      const response = await fetch(endPoints.groups.addMembers(groupId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          members,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.errors) {
          throw errorData.errors;
        }
        throw new Error("Error adding members to group");
      }

      const data = await response.json();
      toast.success("Successfully added members to group");
      return data;
    } catch (error) {
      console.error("Add Members Error:", error);
      toast.error(error instanceof Error ? error.message : "Error adding members to group");
      throw error;
    }
  };

  const uploadDocument = async (
    groupId: string,
    documentData: {
      title: string;
      type: string;
      content: string;
      fileUrl?: string;
    }
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(endPoints.groups.uploadDocument(groupId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.errors) throw errorData.errors;
        throw new Error("Error uploading document");
      }

      const data = await response.json();
      toast.success("Document uploaded successfully");
      return data;
    } catch (error) {
      console.error("Upload Document Error:", error);
      toast.error("Error uploading document");
      throw error;
    }
  };

  const createPolicy = async (
    groupId: string,
    policyData: {
      name: string;
      type:
        | "LOAN"
        | "CONTRIBUTION"
        | "FINE"
        | "DIVIDEND"
        | "MEMBER"
        | "GENERAL";
      content: object;
    }
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(endPoints.groups.createPolicy(groupId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(policyData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.errors) throw errorData.errors;
        throw new Error("Error creating policy");
      }

      const data = await response.json();
      toast.success("Policy created successfully");
      return data;
    } catch (error) {
      console.error("Create Policy Error:", error);
      toast.error("Error creating policy");
      throw error;
    }
  };

  const getMetrics = async (groupId: string, period?: string) => {
    try {
      const token = await getToken();
      const url = new URL(endPoints.groups.getMetrics(groupId));
      if (period) url.searchParams.append("period", period);

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch metrics");
      return await response.json();
    } catch (error) {
      console.error("Get Metrics Error:", error);
      toast.error("Error fetching metrics");
      throw error;
    }
  };

  const initiateGroupClosure = async (
    groupId: string,
    closureData: {
      closureDate: string;
      reason: string;
    }
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(
        endPoints.groups.initiateGroupClosure(groupId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(closureData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.errors) throw errorData.errors;
        throw new Error("Error initiating group closure");
      }

      const data = await response.json();
      toast.success("Group closure initiated successfully");
      return data;
    } catch (error) {
      console.error("Group Closure Error:", error);
      toast.error("Error initiating group closure");
      throw error;
    }
  };

  const updateMember = async (
    groupId: string,
    memberId: string,
    updates: any
  ) => {
    try {
      const token = await getToken();
      const response = await fetch(
        `${endPoints.groups.addMembers(groupId)}/${memberId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        if (errorData?.errors) throw errorData.errors;
        throw new Error("Error updating member");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Update Member Error:", error);
      throw error;
    }
  };

  return useMemo(
    () => ({
      create,
      getAll,
      updateGroup,
      remove,
      groups,
      getTypes,
      getById,
      policies,
      addSettings,
      getSettings,
      addMembers,
      getPolicies,
      uploadDocument,
      createPolicy,
      getMetrics,
      initiateGroupClosure,
      updateMember,
    }),
    [groups, getToken]
  );
}
