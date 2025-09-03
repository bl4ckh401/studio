"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SettingsChange } from "@/app/types/settings";
import { endPoints } from "@/lib/api/endpoints";
import toast from "react-hot-toast";

export function useSettingsApproval() {
  const [loading, setLoading] = useState(false);
  const { getToken, user } = useAuth();

  /**
   * Create a settings change request that will need approval
   */  
  const createSettingsChange = async (
    groupId: string,
    settingType:
      | "GROUP_SETTINGS"
      | "MEMBER_ROLE_UPDATE"
      | "CONTRIBUTION_SETTINGS"
      | "LOAN_SETTINGS",
    oldValue: any,
    newValue: any,
    description: string
  ): Promise<SettingsChange | null> => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `${endPoints.groups.settingsChanges(groupId)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            settingType,
            oldValue,
            newValue,
            description,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.message || "Failed to create settings change request"
        );
      }

      const data = await response.json();
      toast.success("Settings change request created successfully");
      return data.data;
    } catch (error: any) {
      console.error("Error creating settings change:", error);
      toast.error(error.message || "Failed to create settings change request");
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get all pending settings changes for a group
   */  
  const getPendingSettingsChanges = async (
    groupId: string
  ): Promise<SettingsChange[]> => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch(
        `${endPoints.groups.settingsChanges(groupId)}?status=PENDING_APPROVAL`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pending settings changes");
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching pending settings changes:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Approve a settings change
   */  const approveSettingsChange = async (changeId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const role = user?.role?.name?.toLowerCase() || '';
      const groupId = changeId.split('-')[0];
      
      let approvalEndpoint;
      if (role.includes('treasurer')) {
        approvalEndpoint = endPoints.groups.approveSettingsChangeAsTreasurer(groupId, changeId);
      } else if (role.includes('secretary')) {
        approvalEndpoint = endPoints.groups.approveSettingsChangeAsSecretary(groupId, changeId);
      } else if (role.includes('chairperson')) {
        approvalEndpoint = endPoints.groups.approveSettingsChangeAsChairperson(groupId, changeId);
      } else {
        throw new Error("You don't have permission to approve this change");
      }
      
      const token = await getToken();
      const response = await fetch(
        approvalEndpoint,
        {
          method: "PATCH", // Backend uses PATCH for approval
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve settings change");
      }

      toast.success("Settings change approved successfully");
      return true;
    } catch (error: any) {
      console.error("Error approving settings change:", error);
      toast.error(error.message || "Failed to approve settings change");
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reject a settings change
   */  const rejectSettingsChange = async (
    changeId: string,
    reason: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      // Extract group ID from the change ID
      const groupId = changeId.split('-')[0]; // This assumes changeId has groupId as prefix
      
      const token = await getToken();
      const response = await fetch(
        `${endPoints.groups.rejectSettingsChange(groupId, changeId)}`,
        {
          method: "PATCH", // Backend uses PATCH for rejection
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reject settings change");
      }

      toast.success("Settings change rejected successfully");
      return true;
    } catch (error: any) {
      console.error("Error rejecting settings change:", error);
      toast.error(error.message || "Failed to reject settings change");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createSettingsChange,
    getPendingSettingsChanges,
    approveSettingsChange,
    rejectSettingsChange,
  };
}
