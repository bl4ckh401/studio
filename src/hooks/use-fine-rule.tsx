"use client";

import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { endPoints } from "@/lib/api/endpoints";
import toast from "react-hot-toast";
import { FineType } from "@/app/types/api";

export interface FineRule {
  id: string;
  groupId: string;
  name: string;
  description?: string;
  amount: number;
  percentage?: number;
  type: FineType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface FineHistory {
  id: string;
  amount: number;
  description: string;
  createdAt: Date;
  status: string;
}

export const useFineRule = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fineRules, setFineRules] = useState<FineRule[]>([]);
  const [fineHistory, setFineHistory] = useState<FineHistory[]>([]);

  const getGroupFineRules = useCallback(
    async (groupId: string, includeInactive: boolean = false) => {
      try {
        setLoading(true);
        const token = await getToken();
        const queryParams = new URLSearchParams({
          includeInactive: includeInactive.toString(),
        });

        const res = await fetch(
          `${endPoints.fineRules.getGroupFineRules(groupId)}?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch fine rules");
        }

        const response = await res.json();
        setFineRules(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching fine rules:", error);
        toast.error("Failed to fetch fine rules");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const createFineRule = useCallback(
    async (data: {
      groupId: string;
      name: string;
      description?: string;
      amount?: number;
      percentage?: number;
      type: FineType;
    }) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.fineRules.create, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error("Failed to create fine rule");
        }

        const response = await res.json();
        toast.success("Fine rule created successfully");
        return response.data;
      } catch (error) {
        console.error("Error creating fine rule:", error);
        toast.error("Failed to create fine rule");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const updateFineRule = useCallback(
    async (
      id: string,
      data: {
        name?: string;
        description?: string;
        amount?: number;
        percentage?: number;
        type?: FineType;
        isActive?: boolean;
      }
    ) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.fineRules.update(id), {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error("Failed to update fine rule");
        }

        const response = await res.json();
        toast.success("Fine rule updated successfully");
        return response.data;
      } catch (error) {
        console.error("Error updating fine rule:", error);
        toast.error("Failed to update fine rule");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const applyFine = useCallback(
    async (data: {
      groupId: string;
      memberId: string;
      fineRuleId: string;
      reason: string;
    }) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.fineRules.apply, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error("Failed to apply fine");
        }

        const response = await res.json();
        toast.success("Fine applied successfully");
        return response.data;
      } catch (error) {
        console.error("Error applying fine:", error);
        toast.error("Failed to apply fine");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const getMemberFineHistory = useCallback(
    async (memberId: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(
          endPoints.fineRules.getMemberFineHistory(memberId),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch fine history");
        }

        const response = await res.json();
        setFineHistory(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching fine history:", error);
        toast.error("Failed to fetch fine history");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  return {
    loading,
    fineRules,
    fineHistory,
    getGroupFineRules,
    createFineRule,
    updateFineRule,
    applyFine,
    getMemberFineHistory,
  };
};
