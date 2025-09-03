import { useState, useMemo, useEffect, useCallback } from "react";
import { Notification, NotificationStatus, NotificationType, TransactionType } from "@/app/types/api";
import { useAuth } from "./useAuth";
import { endPoints } from "@/lib/api/endpoints";
import { createWsClient } from "@/lib/api/wsClient";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTransaction } from "./use-transaction";

interface PaginationParams {
  limit?: number;
  offset?: number;
}

interface PaginationResponse {
  data: Notification[];
  total: number;
  limit: number;
  offset: number;
  unreadCount: number;
}

interface NotificationAction {
  label: string;
  onClick: () => void;
}

interface ExtendedNotification extends Notification {
  actions?: NotificationAction[];
}

export interface LoanNotificationAction {
  type: "APPROVE" | "REJECT";
  loanId: string;
  role: "GUARANTOR" | "TREASURER" | "SECRETARY" | "CHAIRPERSON";
}

export function useNotification() {
  const [notifications, setNotifications] = useState<ExtendedNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState<PaginationResponse>({
    data: [],
    total: 0,
    limit: 10,
    offset: 0,
    unreadCount: 0
  });
  const { getToken, user } = useAuth();
  const router = useRouter();
  const { approveAsGuarantor, approveAsTreasurer } = useTransaction();

  useEffect(() => {
    const initializeWebSocket = async () => {
      const token = await getToken();
      const wsClient = createWsClient(token);
      wsClient.connect();      wsClient.listen("notification", (notification) => {
        // Normalize notification type if needed
        const normalizedType = notification.type || NotificationType.TRANSACTION;
          // Check what kind of transaction this is from transactionType if available
        let transactionType = notification.data?.transactionType;
        let notificationType = normalizedType;
        
        // Ensure we're using the correct notification type
        if (transactionType) {
          // If this is an expense or income but marked as a fine notification, correct it
          if (
            (transactionType === TransactionType.EXPENSE || 
             transactionType === TransactionType.INCOME ||
             transactionType === TransactionType.CONTRIBUTION ||
             transactionType === TransactionType.REPAYMENT) && 
            notificationType === NotificationType.FINE
          ) {
            notificationType = NotificationType.TRANSACTION;
          } else if (transactionType === TransactionType.LOAN && notificationType !== NotificationType.LOAN) {
            notificationType = NotificationType.LOAN;
          } else if (transactionType === TransactionType.FINE && notificationType !== NotificationType.FINE) {
            notificationType = NotificationType.FINE;
          }
        }
        
        // Add new notification to the list with action buttons if it's a loan notification
        const newNotification: ExtendedNotification = {
          id: Date.now().toString(),
          userId: user?.id || "",
          status: NotificationStatus.UNREAD,
          message: notification.message,
          type: notificationType, // Use our corrected type
          read: false,
          createdAt: new Date().toISOString(),
          actions: notificationType === NotificationType.LOAN ? [
            {
              label: "View Loan",
              onClick: () => router.push(`/dashboard/loans/${notification.data?.loanId}`),
            },
            ...(notification.data?.requiresAction ? [
              {
                label: "Approve",
                onClick: async () => {
                  try {
                    if (notification.data.role === "GUARANTOR") {
                      await approveAsGuarantor(notification.data.loanId);
                    } else if (notification.data.role === "TREASURER") {
                      await approveAsTreasurer(notification.data.loanId);
                    }
                    toast.success("Loan approved successfully");
                  } catch (error) {
                    toast.error("Failed to approve loan");
                  }
                },
              },
              {
                label: "Reject",
                onClick: () => router.push(`/dashboard/loans/${notification.data.loanId}?action=reject`),
              },
            ] : []),
          ] : [],
        };

        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        setPagination((prev) => ({
          ...prev,
          total: prev.total + 1,
        }));        // Show toast for notifications based on their type
        if (notificationType === NotificationType.LOAN) {
          // Special toast for loan notifications with approve/reject actions
          toast.custom((t) => (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-white font-medium">{notification.message}</h3>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={() => {
                    router.push(`/dashboard/loans/${notification.data?.loanId}`);
                    toast.dismiss(t.id);
                  }}
                  className="text-sm text-[#93F1AD] hover:underline"
                >
                  View Details
                </button>
                {notification.data?.requiresAction && (
                  <>
                    <button
                      onClick={async () => {
                        try {
                          if (notification.data.role === "GUARANTOR") {
                            await approveAsGuarantor(notification.data.loanId);
                          } else if (notification.data.role === "TREASURER") {
                            await approveAsTreasurer(notification.data.loanId);
                          }
                          toast.success("Loan approved successfully");
                        } catch (error) {
                          toast.error("Failed to approve loan");
                        }
                        toast.dismiss(t.id);
                      }}
                      className="text-sm text-green-500 hover:underline"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        router.push(`/dashboard/loans/${notification.data.loanId}?action=reject`);
                        toast.dismiss(t.id);
                      }}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ), {
            duration: 10000,
          });
        } else if (notificationType === NotificationType.FINE) {
          // Standard toast for fine notifications
          toast.custom((t) => (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-white font-medium">{notification.message}</h3>
              <p className="mt-1 text-sm text-gray-400">Fine Notification</p>
            </div>
          ), {
            duration: 8000,
          });
        } else if (notificationType === NotificationType.TRANSACTION) {
          // Standard toast for transaction notifications
          toast.custom((t) => (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-white font-medium">{notification.message}</h3>
              <p className="mt-1 text-sm text-gray-400">Transaction Notification</p>
            </div>
          ), {
            duration: 8000,
          });
        }
      });

      return () => {
        wsClient.disconnect();
      };
    };

    if (user?.id) {
      initializeWebSocket();
    }
  }, [getToken, user]);

  const getUserNotifications = useCallback(async (
    params: PaginationParams = { limit: 10, offset: 0 }
  ) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const queryParams = new URLSearchParams({
        limit: params.limit?.toString() || "10",
        offset: params.offset?.toString() || "0",
      });

      const res = await fetch(
        `${endPoints.notifications.getAll}?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const response = await res.json();

      // Ensure notifications are sorted newest-first by createdAt (fallback to 0)
      const sortedData: Notification[] = (response.data || []).slice().sort((a: Notification, b: Notification) => {
        const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        return tb - ta;
      });

      setNotifications(sortedData);

      // Calculate unread count (prefer response.unreadCount when provided)
      const unread = sortedData.filter((n: Notification) => n.status === NotificationStatus.UNREAD).length;
      setUnreadCount(response.unreadCount ?? unread);

      setPagination({
        data: sortedData,
        total: response.total || sortedData.length || 0,
        limit: params.limit || 10,
        offset: params.offset || 0,
        unreadCount: response.unreadCount ?? unread ?? 0,
      });

      return sortedData;
    } catch (error) {
      console.error("Get All Notifications Error:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch notifications"
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const markAllAsRead = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(endPoints.notifications.markAllAsRead, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      // Update unread count to 0
      setUnreadCount(0);

      // Refresh notifications after marking as read
      await getUserNotifications({
        limit: pagination.limit,
        offset: pagination.offset,
      });
    } catch (error) {
      console.error("Mark All As Read Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to mark notifications as read"
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, getUserNotifications, pagination.limit, pagination.offset]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const res = await fetch(endPoints.notifications.markAsRead(id), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to mark notification as read");
      }

      // Decrease unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));

      // Refresh notifications after marking as read
      await getUserNotifications({
        limit: pagination.limit,
        offset: pagination.offset,
      });
    } catch (error) {
      console.error("Mark As Read Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to mark notification as read"
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, getUserNotifications, pagination.limit, pagination.offset]);

  return useMemo(
    () => ({
      getUserNotifications,
      notifications,
      loading,
      error,
      pagination,
      markAllAsRead,
      markAsRead,
      unreadCount,
    }),
    [
      notifications,
      loading,
      error,
      pagination,
      getUserNotifications,
      markAllAsRead,
      markAsRead,
      unreadCount,
    ]
  );
}
