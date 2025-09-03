import { useState, useMemo } from "react";
import { Role } from "@/app/types/api";
import { useAuth } from "./useAuth";
import { endPoints } from "@/lib/api/endpoints";

export function useGroupMember() {
  const [roles, setRoles] = useState<Role[]>([]);
  const { getToken } = useAuth();

  const getAll = async () => {
    try {
      const token = await getToken();
      const res = await fetch(endPoints.roles.getAll, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch roles");
      }
      const response = await res.json();

      setRoles(response.data);
      return response.data;
    } catch (error) {
      console.error("Get All Groups Error:", error);
      return [];
    }
  };

  return useMemo(() => ({ getAll, roles }), [roles, getToken]);
}
