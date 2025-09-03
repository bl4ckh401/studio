import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/app/types/api";

interface AuthState {
  user: User | null;
  token: string | null;
  users: Array<User> | [];
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  setUsers: (users: Array<User>) => void;
  clearAuth: () => void;
}

// Enhanced function to create deep copies of objects with special handling for role
function deepCopy<T>(obj: T): T {
  if (!obj) return obj;
  const str = JSON.stringify(obj);
  const parsed = JSON.parse(str);

  // If this is a user object with a roleId but no proper role object, try to preserve it
  if (parsed && typeof parsed === "object" && "roleId" in parsed) {
    // If original had a role object but it was lost in the serialization
    if (
      (obj as any).role &&
      typeof (obj as any).role === "object" &&
      (!parsed.role || typeof parsed.role !== "object")
    ) {
      parsed.role = (obj as any).role;
    }
  }

  return parsed;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      users: [],
      setUser: (user) => set({ user: user ? deepCopy(user) : null }),
      setToken: (token) => set({ token }),
      setUsers: (users) => set({ users: deepCopy(users) }),
      clearAuth: () => set({ user: null, token: null }),
    }),    {
      name: "auth-storage"
    }
  )
);
