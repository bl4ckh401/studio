"use client";

import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { CommunicationMessage } from "@/lib/api/communications";
import toast from "react-hot-toast";
import { endPoints } from "@/lib/api/endpoints";

export const useCommunication = () => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });

  const getMessages = useCallback(
    async (groupId: string, page: number = 1, limit: number = 10) => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) {
          const msg = "No authentication token available for fetching messages";
          console.error(msg);
          toast.error(msg);
          return;
        }
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        // Build and normalize URL (defend against duplicated /api/v1 in env values)
        let url = `${endPoints.communications.getMessages(groupId)}?${queryParams.toString()}`;
        url = url.replace(/\/api\/v1\/api\/v1/g, "/api/v1");
        console.debug("Fetching messages URL:", url);

        const doFetch = async (fetchUrl: string) =>
          await fetch(fetchUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

        let res = await doFetch(url);

        // If server returns 404 try a couple of safe fallbacks without touching backend
        if (res.status === 404) {
          // Candidate 1: remove a duplicated '/api/v1/' segment if present
          const candidate1 = url.replace(/\/api\/v1\//, "/api/");
          if (candidate1 !== url) {
            console.debug("Messages: retrying with candidate1:", candidate1);
            try {
              res = await doFetch(candidate1);
            } catch (e) {
              // ignore and try next
            }
          }

          // Candidate 2: build from NEXT_PUBLIC_API_URL without the embedded /api/v1
          if (res.status === 404) {
            const base = process.env.NEXT_PUBLIC_API_URL || "";
            if (base) {
              const candidate2 = `${base.replace(/\/$/, "")}/communications/groups/${groupId}?${queryParams.toString()}`;
              console.debug("Messages: retrying with candidate2:", candidate2);
              try {
                res = await doFetch(candidate2);
              } catch (e) {
                // final fallback will surface original 404
              }
            }
          }
        }

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(`Failed to fetch messages: ${res.status} ${res.statusText} ${text}`);
        }

        const response = await res.json().catch(() => null);
        if (response && response.data) {
          setMessages(response.data.communications || []);
          setPagination(response.data.pagination || pagination);
        } else {
          // unexpected shape, but don't crash the app
          setMessages([]);
          setPagination((p) => ({ ...p, total: 0 }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const getAdminMessages = useCallback(
    async (page: number = 1, limit: number = 10) => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) {
          throw new Error("No authentication token found");
        }

        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        const res = await fetch(
          `${endPoints.communications.getAdminMessages}?${queryParams}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch admin messages");
        }

        const response = await res.json();
        setMessages(response.data.communications);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const sendMessage = useCallback(
    async (data: {
      groupId: string;
      subject: string;
      message: string;
      recipients: {
        type: "ALL" | "ROLE" | "USER";
        roleId?: string;
        userId?: string;
      }[];
    }) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.communications.sendMessage, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          throw new Error("Failed to send message");
        }

        const response = await res.json();
        toast.success("Message sent successfully");
        return response;
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await fetch(endPoints.communications.markAsRead(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to mark message as read");
        }

        // Update the message status in local state
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === id
              ? {
                  ...msg,
                  recipients: msg.recipients.map((recipient) => ({
                    ...recipient,
                    isRead: true,
                  })),
                }
              : msg
          )
        );
      } catch (error) {
        console.error("Error marking message as read:", error);
        toast.error("Failed to mark message as read");
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  return {
    loading,
    messages,
    pagination,
    getMessages,
    getAdminMessages,
    sendMessage,
    markAsRead,
  };
};
