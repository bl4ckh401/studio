"use client";

import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { endPoints } from "@/lib/api/endpoints";

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status:
    | "IN_PROGRESS"
    | "ACHIEVED"
    | "FAILED"
    | "PENDING_APPROVAL"
    | "REJECTED";
  description?: string;
  createdBy?: string;
  createdByTreasurer?: boolean;
  requiresApproval?: boolean;
  treasurerApproved?: boolean;
  secretaryApproved?: boolean;
  chairpersonApproved?: boolean;
  rejectionReason?: string;
}

export interface CreateGoalData {
  title: string;
  targetAmount: number;
  deadline: string;
  description?: string;
}

export interface UpdateGoalData {
  title?: string;
  targetAmount?: number;
  currentAmount?: number;
  deadline?: string;
  status?:
    | "IN_PROGRESS"
    | "ACHIEVED"
    | "FAILED"
    | "PENDING_APPROVAL"
    | "REJECTED";
  description?: string;
  treasurerApproved?: boolean;
  secretaryApproved?: boolean;
  chairpersonApproved?: boolean;
  rejectionReason?: string;
}

export const useGoals = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  const getGroupGoals = useCallback(
    async (groupId: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.goals.getGroupGoals(groupId), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch goals");
        }
        const response = await res.json();
        setGoals(response.data || []);
        return response.data || [];
      } catch (error) {
        console.error("Error fetching goals:", error);
        toast.error("Failed to fetch goals");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const createGoal = useCallback(
    async (groupId: string, data: CreateGoalData) => {
      try {
        setLoading(true);
        const token = await getToken();

        // Check if current user is a treasurer to set requiresApproval flag
        const storeUser = useAuthStore.getState().user;
        const userRole = storeUser?.role?.name || storeUser?.role || "";
        const isTreasurer =
          typeof userRole === "string" &&
          userRole.toLowerCase().includes("treasurer");

        const res = await fetch(endPoints.goals.createGoal, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...data,
            groupId,
            // Mark goals created by treasurer as requiring approval
            requiresApproval: isTreasurer,
            createdByTreasurer: isTreasurer,
            // If created by treasurer, automatically set treasurer approval
            treasurerApproved: isTreasurer,
            // Set status to PENDING_APPROVAL if created by treasurer
            status: isTreasurer ? "PENDING_APPROVAL" : "IN_PROGRESS",
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.errors?.[0]?.message || "Failed to create goal"
          );
        }
        const response = await res.json();
        setGoals((prev) => [...prev, response.data]);

        // Show different message based on approval requirement
        if (isTreasurer) {
          toast.success(
            "Goal submitted for approval from other office bearers"
          );
        } else {
          toast.success("Goal created successfully");
        }

        return response.data;
      } catch (error) {
        console.error("Error creating goal:", error);        // Check for specific backend error about office bearers
        if (error instanceof Error && error.message.includes("Group must have all required office bearers")) {
          toast.error(
            "Cannot create goal: This group needs both a Treasurer and a Chama Admin to enable goal creation. Please contact your group administrator to assign these roles."
          );
        } else if (error instanceof Error && error.message.includes("400")) {
          // Handle other 400 errors more gracefully
          toast.error("Failed to create goal: " + error.message);
        } else {
          toast.error(
            error instanceof Error ? error.message : "Failed to create goal"
          );
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const updateGoal = useCallback(
    async (id: string, data: UpdateGoalData) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.goals.updateGoal(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.errors?.[0]?.message || "Failed to update goal"
          );
        }
        const response = await res.json();
        setGoals((prev) =>
          prev.map((goal) => (goal.id === id ? response.data : goal))
        );
        toast.success("Goal updated successfully");
        return response.data;
      } catch (error) {
        console.error("Error updating goal:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to update goal"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.goals.deleteGoal(id), {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.errors?.[0]?.message || "Failed to delete goal"
          );
        }

        setGoals((prev) => prev.filter((goal) => goal.id !== id));
        toast.success("Goal deleted successfully");
      } catch (error) {
        console.error("Error deleting goal:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to delete goal"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const markGoalComplete = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.goals.markGoalComplete(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.errors?.[0]?.message || "Failed to mark goal as complete"
          );
        }
        const response = await res.json();
        setGoals((prev) =>
          prev.map((goal) => (goal.id === id ? response.data : goal))
        );
        toast.success("Goal marked as complete");
        return response.data;
      } catch (error) {
        console.error("Error marking goal as complete:", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to mark goal as complete"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const approveGoalAsTreasurer = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.goals.approveByTreasurer(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.errors?.[0]?.message || "Failed to approve goal"
          );
        }
        const response = await res.json();
        setGoals((prev) =>
          prev.map((goal) => (goal.id === id ? response.data : goal))
        );
        toast.success("Goal approved by treasurer");
        return response.data;
      } catch (error) {
        console.error("Error approving goal:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to approve goal"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const approveGoalAsSecretary = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.goals.approveBySecretary(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.errors?.[0]?.message || "Failed to approve goal"
          );
        }
        const response = await res.json();
        setGoals((prev) =>
          prev.map((goal) => (goal.id === id ? response.data : goal))
        );
        toast.success("Goal approved by secretary");
        return response.data;
      } catch (error) {
        console.error("Error approving goal:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to approve goal"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const approveGoalAsChairperson = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.goals.approveByChairperson(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.errors?.[0]?.message || "Failed to approve goal"
          );
        }
        const response = await res.json();
        setGoals((prev) =>
          prev.map((goal) => (goal.id === id ? response.data : goal))
        );
        toast.success("Goal approved by chairperson");
        return response.data;
      } catch (error) {
        console.error("Error approving goal:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to approve goal"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const rejectGoal = useCallback(
    async (id: string, reason: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.goals.reject(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.errors?.[0]?.message || "Failed to reject goal"
          );
        }
        const response = await res.json();
        setGoals((prev) =>
          prev.map((goal) => (goal.id === id ? response.data : goal))
        );
        toast.success("Goal rejected");
        return response.data;
      } catch (error) {
        console.error("Error rejecting goal:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to reject goal"
        );
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  return {
    loading,
    goals,
    getGroupGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    markGoalComplete,
    approveGoalAsTreasurer,
    approveGoalAsSecretary,
    approveGoalAsChairperson,
    rejectGoal,
  };
};
