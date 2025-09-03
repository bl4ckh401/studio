"use client";

import { User } from "@/app/types/api";
import { useLoading } from "@/context/LoadingContext";
import { endPoints } from "@/lib/api/endpoints";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

type AuthContextType = {
  user: User | null;
  users: Array<User> | [];
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  getToken(): Promise<string>;
  meAuth(): Promise<User | null>;
  getUsers(): Promise<Array<User>>;
  updateProfile: (
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    address?: string,
    city?: string,
    country?: string,
    nationalId?: string
  ) => Promise<void>;
  updateProfilePicture: (file: File) => Promise<void>;
  logout: () => void;
  currentUserUpdatePassword(
    password: string,
    confirmPassword: string
  ): Promise<void>;
  requestPasswordReset: (username: string) => Promise<{ message: string }>;
  resetPassword: (
    username: string,
    token: string,
    newPassword: string
  ) => Promise<{ message: string }>;
  forgotPassword: (email: string) => Promise<any>;
  isUserVerified: () => boolean;
  resendVerificationEmail: (email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  send2FACode: () => Promise<void>;
  verify2FA: (code: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loading, setLoading } = useLoading();
  const router = useRouter();
  const { user, users, setUser, setToken, setUsers, clearAuth } =
    useAuthStore();

  useEffect(() => {
    meAuth();
  }, []);
  async function meAuth(): Promise<User | null> {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      
      if (data.user) {
        const userData = JSON.parse(JSON.stringify(data.user));
        
        if (userData.roleId && !userData.role && data.user.role) {
          userData.role = data.user.role;
        }
        
        setUser(userData);
        return userData;
      }
      return null;
    } catch (error) {
      setUser(null);
      return null;
    }
  }

  async function getUsers(): Promise<Array<User>> {
    try {
      const token = await getToken();
      const res = await fetch(endPoints.auth.users, {
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
      setUsers(response.data);
      return response.data;
    } catch (error) {
      console.error("Get All Groups Error:", error);
      return [];
    }
  }
  async function login(username: string, password: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await res.json();
      if (!data.user || !data.token) {
        throw new Error("Invalid response from server");
      }
      
      // Check if the user is verified
      if (data.user.isVerified === false) {
        // Set the user in the state so we have their information
        setUser(data.user as User);
        setToken(data.token);
        
        // Redirect to the verification page
        toast.error("Please verify your email before logging in");
        router.push(`/auth/verify?email=${encodeURIComponent(data.user.email)}`);
        return;
      }
      
      // If server requires 2FA for this user, redirect to 2FA page
      if (data.requires2FA) {
        // store token temporarily if provided so 2FA endpoint can use it
        if (data.token) setToken(data.token);
        setUser(data.user as User);
        router.push('/auth/2fa');
        return;
      }
      
      setUser(data.user as User);
      setToken(data.token);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      throw error;
    }
  }

  async function getToken(): Promise<string> {
    // First check if we already have a token in the store
    const storeToken = useAuthStore.getState().token;
    if (storeToken) {
      return storeToken;
    }
    
    // Only fetch from API if we don't have a token in store
    try {
      const res = await fetch("/api/auth/token");
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      setToken(data.token);
      return data.token;
    } catch (error) {
      console.error("Error fetching token:", error);
      return "";
    }
  }
  async function requestPasswordReset(
    email: string
  ): Promise<{ message: string }> {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.message || "Failed to request password reset");
    }
    const { message } = await res.json();
    return { message };
  }

  async function verifyEmail(email: string, code: string): Promise<void> {
    try {
      setLoading(true);
      const res = await fetch(endPoints.auth.verifyEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Verification failed');
      }
      toast.success('Email verified successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify email');
      throw error;
    } finally {
      setLoading(false);
    }
  }
  async function resetPassword(
    email: string,
    token: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password: newPassword }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => null);
      throw new Error(error?.message || "Failed to reset password");
    }
    const { message } = await res.json();
    return { message };
  }

  function logout() {
    setLoading(true);
    try {
      document.cookie = "auth_token=; Max-Age=0; path=/";
      clearAuth();
      toast.success("Successfully logged out. Welcome again!!");
      router.push("/login");
    } catch (error) {
      toast.error("Error logging out!!");
    } finally {
      setLoading(false);
    }
  }  async function updateProfile(
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
    address?: string,
    city?: string,
    country?: string,
    nationalId?: string
  ): Promise<void> {
    const token = await getToken();
    const res = await fetch(`${endPoints.auth.updateProfile}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        email, 
        firstName, 
        lastName, 
        phone,
        ...(address && { address }),
        ...(city && { city }),
        ...(country && { country }),
        ...(nationalId && { nationalId }),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || "Updating profile failed");
    }
    const response = await res.json();
    setUser(response.data);
  }
  async function currentUserUpdatePassword(
    password: string,
    confirmPassword: string
  ): Promise<void> {
    const token = await getToken();
    const res = await fetch(`${endPoints.auth.updatePassword}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password, confirmPassword }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      if (errorData?.errors) {
        throw errorData.errors;
      }
      throw new Error("Updating password failed");
    }

    const response = await res.json();
    setUser(response.data);
  }
  async function signup(data: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
  }) {
    try {
      setLoading(true);
      const res = await fetch(endPoints.auth.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Registration failed");
      }

      // Check if the data exists and has the expected user information
      if (!responseData.data) {
        throw new Error("Invalid response from server");
      }
      
      // Mark the user as unverified initially
      const userData = {
        ...responseData.data,
        isVerified: false
      };
      
      // Set the user from the response data
      setUser(userData);
      
      // For token, we'll try to get it from the response data, or get it via API if needed
      if (responseData.token) {
        setToken(responseData.token);
      } else {
        // If no token in response, we'll need to get it separately
        // This is just to handle the current response format
        await getToken();
      }
      
      // Send verification email
      try {
        await fetch("/api/auth/verify", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });
      } catch (verifyError) {
        console.error("Error sending verification email:", verifyError);
        // We'll continue with signup even if email sending fails
      }
      
      toast.success("Account created successfully! Please verify your email.");
      router.push(`/auth/success?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account");
      throw error;
    } finally {
      setLoading(false);
    }
  }  async function forgotPasswordHandler(email: string) {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send reset password link");
      }

      return await response.json();
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      throw error;
    }
  }

  async function resendVerificationEmail(email: string): Promise<void> {
    try {
      setLoading(true);
      const res = await fetch(endPoints.auth.resendVerification, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || 'Failed to resend verification email');
      }
      toast.success('Verification email sent successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend verification email');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function send2FACode(): Promise<void> {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(endPoints.auth.twoFA.send, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to send 2FA code');
      toast.success('2FA code sent');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send 2FA code');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function verify2FA(code: string): Promise<void> {
    try {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(endPoints.auth.twoFA.verify, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.message || '2FA verification failed');
      }
      const data = await res.json();
      if (data.token) setToken(data.token);
      toast.success('2FA successful');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify 2FA');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updateProfilePicture(file: File): Promise<void> {
    try {
      setLoading(true);
      const token = await getToken();
      
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await fetch(`${endPoints.auth.updateProfilePicture}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile picture');
      }
      
      const data = await response.json();
      setUser(data.data);
      toast.success('Profile picture updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile picture');
      throw error;
    } finally {
      setLoading(false);
    }
  }
  function isUserVerified(): boolean {
    // Check if the user exists and is verified
    return !!user?.isVerified;
  }

  
  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        loading,
        login,
        signup,
        getToken,
        meAuth,
        logout,
        requestPasswordReset,
        updateProfile,
        resetPassword,
        currentUserUpdatePassword,
        getUsers,
        forgotPassword: forgotPasswordHandler,
        updateProfilePicture,
        isUserVerified,
        resendVerificationEmail,
        verifyEmail,
        send2FACode,
        verify2FA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
