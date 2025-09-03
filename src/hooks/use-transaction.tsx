// IMPORTANT: When a treasurer or office bearer is adding a contribution, expense, or income on behalf of another user,
// the selected user's userId (not the treasurer's) MUST be passed as the userId in the request body.
// This ensures the transaction is recorded for the correct user. All transaction creation functions below expect this behavior.

import { useState, useMemo } from "react";
import {
  Transaction,
  NotificationType,
  TransactionType,
} from "@/app/types/api";
import { useAuth } from "./useAuth";
import { endPoints } from "@/lib/api/endpoints";
import toast from "react-hot-toast";

interface GuarantorNotification {
  userId: string;
  type: NotificationType;
  message: string;
  data: {
    loanId: string;
    requiresAction: boolean;
    role: string;
    amount: number;
  };
}

export function useTransaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { getToken, user } = useAuth();

  const getPaymentMethods = async () => {
    try {
      const token = await getToken();
      const res = await fetch(endPoints.transactions.methods, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch payment methods");
      }
      const response = await res.json();

      return response.data;
    } catch (error) {
      console.error("Get payment methods Error:", error);
      return [];
    }
  };

  // Helper function to map transaction types to notification types
  const getNotificationTypeForTransaction = (
    transactionType: TransactionType
  ) => {
    switch (transactionType) {
      case TransactionType.LOAN:
        return NotificationType.LOAN;
      case TransactionType.FINE:
        return NotificationType.FINE;
      case TransactionType.INCOME:
      case TransactionType.EXPENSE:
      case TransactionType.CONTRIBUTION:
      case TransactionType.REPAYMENT:
      default:
        return NotificationType.TRANSACTION;
    }
  };
  const makeContribution = async (reqBody: any) => {
    try {
      const token = await getToken();
      // Check if this is a manual entry by treasurer or a regular member contribution
      const isManualEntry = reqBody.isManualEntry === true;
      const isCashPayment = reqBody.paymentMethod === "CASH";
      const userRole = reqBody.userRole?.toLowerCase() || "";
      const isTreasurer = userRole.includes("treasurer");

      // Enforce correct userId: if treasurer, userId must be set and not equal to treasurer's own id
      // (Assume useAuth().user is available for current user id)
      let enforcedUserId = reqBody.userId;
      if (isTreasurer) {
        if (!reqBody.userId) {
          throw new Error(
            "Treasurer must specify the userId of the member for whom the transaction is being made."
          );
        }
        if (user && reqBody.userId === user.id) {
          // Optionally warn, but allow if treasurer is making for self
          // toast.warn("Treasurer is making a transaction for themselves.");
        }
      }

      // ALL entries by treasurers always require approval from secretary and chairperson, regardless of payment method
      // For regular members, only non-cash payments require approval
      const needsApprovalWorkflow =
        isTreasurer ||
        isManualEntry ||
        reqBody.requiresApproval === true ||
        (!isCashPayment && !isTreasurer);

      const response = await fetch(endPoints.transactions.contribute, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...reqBody,
          userId: enforcedUserId, // Always use the enforced userId
          // Only mark as completed if it's a cash payment by a regular member
          isCashPayment: isCashPayment && !needsApprovalWorkflow,
          // Flag to indicate this needs approval
          isManualEntry: needsApprovalWorkflow,
          // Add additional flags for clarity in the approval process
          createdByTreasurer: isTreasurer,
          requiresApproval: needsApprovalWorkflow,
          status: needsApprovalWorkflow ? "PENDING" : "COMPLETED",
          treasurerApproved: isTreasurer ? true : false, // Auto-approve if created by treasurer
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        if (errorData?.errors) {
          throw errorData.errors;
        }
        throw new Error("Error making contribution");
      }
      const data = await response.json();
      // Different messages based on user role, payment method, and approval needs
      if (isTreasurer) {
        // All treasurer actions need approval, regardless of payment method
        toast.success(
          "Treasurer contribution submitted for approval from secretary and chairperson"
        );
      } else if (isManualEntry) {
        // Manual entries always need approval
        toast.success(
          "Contribution submitted for approval from office bearers"
        );
      } else if (isCashPayment) {
        // Cash payments by regular members don't need approval
        toast.success("Cash contribution completed successfully");
      } else {
        // Other payment methods need approval
        toast.success(
          "Contribution submitted and pending approval from office bearers"
        );
      }

      return data;
    } catch (error) {
      console.error("Create make contribution:", error);
      toast.error("Error making contribution");
      return `Error make contribution`;
    }
  };

  const getAll = async (
    groupId: string,
    offset: number,
    limit: number,
    type: string = "CONTRIBUTION"
  ) => {
    try {
      const token = await getToken();
      const res = await fetch(
        endPoints.transactions.getGroupTransactions(
          groupId,
          offset,
          limit,
          type
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch groups");
      }
      const response = await res.json();

      // Process transactions to ensure guarantors array exists
      const processedTransactions = response.data.map((transaction: any) => {
        // Initialize guarantors array if it doesn't exist
        if (!transaction.guarantors && transaction.transactionType === "LOAN") {
          return {
            ...transaction,
            guarantors: [],
          };
        }
        return transaction;
      });

      setTransactions(processedTransactions);
      return processedTransactions;
    } catch (error) {
      console.error("Get All Groups Error:", error);
      return [];
    }
  };
  const addLoanAndExpense = async (reqBody: any) => {
    try {
      const token = await getToken(); // Check if this is a manual entry by treasurer
      const isManualEntry =
        reqBody.isManualEntry === true || reqBody.requiresApproval === true;

      // Check if created by treasurer or other office bearer
      const userRole = reqBody.userRole?.toLowerCase() || "";
      const isTreasurer = userRole.includes("treasurer");

      // Enforce correct userId: if treasurer, userId must be set and not equal to treasurer's own id
      let enforcedUserId = reqBody.userId;
      if (isTreasurer) {
        if (!reqBody.userId) {
          throw new Error(
            "Treasurer must specify the userId of the member for whom the transaction is being made."
          );
        }
        if (user && reqBody.userId === user.id) {
          // Optionally warn, but allow if treasurer is making for self
        }
      }

      // ALL entries by treasurers now require approval, regardless of type or payment method
      // This includes cash contributions, expenses, income, and fines
      const requiresApproval =
        isTreasurer || isManualEntry || reqBody.requiresApproval === true;

      // Determine the correct notification type based on transaction type
      const notificationType = getNotificationTypeForTransaction(
        reqBody.transactionType
      );

      const response = await fetch(endPoints.transactions.addLoanAndExpense, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...reqBody,
          userId: enforcedUserId, // Always use the enforced userId
          // Add flag to indicate this needs the approval workflow - ALL treasurer entries need approval
          requiresApproval: requiresApproval,
          // Flag for manual entry or treasurer entry
          isManualEntry: isManualEntry || isTreasurer,
          // Flag for treasurer-created entries
          createdByTreasurer: isTreasurer,
          // Auto-approve treasurer portion if created by treasurer
          treasurerApproved: isTreasurer ? true : false,
          // Explicitly set the status based on approval needs
          status: requiresApproval ? "PENDING" : "COMPLETED",
          // Explicitly set the correct notification type
          notificationType: notificationType,
          // Also include transaction type in the data so the notification handler can validate
          transactionType: reqBody.transactionType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add loan and expense");
      }

      const data = await response.json();
      setTransactions([...transactions, data.data]);
      const messagePrefix = isTreasurer ? "Treasurer " : "";

      if (reqBody.transactionType === "LOAN") {
        toast.success(`${messagePrefix}Loan request submitted for approval`);
      } else if (reqBody.transactionType === "EXPENSE") {
        toast.success(
          `${messagePrefix}Expense submitted for approval from secretary and chairperson`
        );
      } else if (reqBody.transactionType === "FINE") {
        toast.success(
          `${messagePrefix}Fine submitted for approval from secretary and chairperson`
        );
      } else if (reqBody.transactionType === "CONTRIBUTION") {
        toast.success(
          `${messagePrefix}Contribution submitted for approval from secretary and chairperson`
        );
      } else if (reqBody.transactionType === "INCOME") {
        toast.success(
          `${messagePrefix}Income record submitted for approval from secretary and chairperson`
        );
      } else if (reqBody.transactionType === "REPAYMENT") {
        toast.success(
          `${messagePrefix}Repayment submitted for approval from secretary and chairperson`
        );
      } else if (reqBody.transactionType === "WITHDRAWAL") {
        toast.success(
          `${messagePrefix}Withdrawal submitted for approval from secretary and chairperson`
        );
      } else if (reqBody.transactionType === "TRANSFER") {
        toast.success(
          `${messagePrefix}Transfer submitted for approval from secretary and chairperson`
        );
      }
      return data.data;
    } catch (error) {
      if (reqBody.transactionType === "LOAN") {
        toast.error("Error adding loan");
      } else if (reqBody.transactionType === "EXPENSE") {
        toast.error("Error adding expense");
      } else if (reqBody.transactionType === "FINE") {
        toast.error("Error adding fine");
      } else if (reqBody.transactionType === "CONTRIBUTION") {
        toast.error("Error adding contribution");
      } else if (reqBody.transactionType === "REPAYMENT") {
        toast.error("Error adding repayment");
      } else if (reqBody.transactionType === "WITHDRAWAL") {
        toast.error("Error adding withdrawal");
      }
      return [];
    }
  };

  const applyLoan = async (reqBody: any) => {
    try {
      const token = await getToken();

      // Validate required fields
      if (
        !reqBody.amount ||
        !reqBody.description ||
        !reqBody.duration ||
        !reqBody.groupId
      ) {
        throw new Error("Missing required fields");
      }

      // Verify loan amount and guarantors
      if (reqBody.amount > reqBody.maxLoanAmount) {
        throw new Error(
          `Maximum loan amount allowed is ${reqBody.maxLoanAmount}`
        );
      }

      if (
        !reqBody.guarantorIds?.length &&
        reqBody.amount > reqBody.userSavings
      ) {
        throw new Error(
          "Guarantors are required for loans exceeding your savings"
        );
      }

      // Format guarantors with proper structure for backend
      const guarantors = (reqBody.guarantorData || []).map(
        (guarantor: any) => ({
          userId: guarantor.userId,
          email: guarantor.email,
          hasApproved: false,
          guarantorShare: reqBody.guarantorShare,
        })
      );

      const response = await fetch(endPoints.transactions.applyLoan, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: reqBody.amount,
          description: reqBody.description,
          duration: reqBody.duration,
          groupId: reqBody.groupId,
          guarantorIds: reqBody.guarantorIds || [],
          guarantors: guarantors, // Include fully structured guarantor data
          transactionType: TransactionType.LOAN,
          requiredGuaranteeAmount: reqBody.requiredGuaranteeAmount,
          guarantorShare: reqBody.guarantorShare,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to apply loan");
      }

      const data = await response.json();

      // If guarantors are required, notify them
      if (reqBody.guarantorIds && reqBody.guarantorIds.length > 0) {
        const guarantorNotifications: GuarantorNotification[] =
          reqBody.guarantorIds.map((guarantorId: string) => ({
            userId: guarantorId,
            type: NotificationType.LOAN,
            title: `Loan guarantee requested`,
            message: `You have been requested to guarantee a loan of KES ${reqBody.amount.toLocaleString()}`,
            data: {
              loanId: data.id,
              requiresAction: true,
              role: "GUARANTOR",
              amount: reqBody.guarantorShare,
            },
          }));

        // Send notifications to guarantors
        await Promise.all(
          guarantorNotifications.map(async (notification) => {
            try {
              await fetch(endPoints.notifications.create, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...notification,
                  recipientId: notification.userId,
                  user: { connect: { id: notification.userId } },
                }),
              });
            } catch (error) {
              console.error("Error sending notification to guarantor:", error);
              // Don't fail the whole operation if notification fails
            }
          })
        );
      }

      toast.success("Loan application submitted successfully");
      return data;
    } catch (error) {
      console.error("Error applying loan:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit loan application");
      }
      throw error; // Re-throw to handle in the component
    }
  };

  const approveAsGuarantor = async (transactionId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        endPoints.transactions.guarantorApproval(transactionId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve loan");
      }

      const data = await response.json();

      // Lock guarantor's funds
      await fetch(endPoints.transactions.lockGuarantorFunds(transactionId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // If all guarantors have approved, notify treasurer
      if (data.allGuarantorsApproved) {
        await fetch(endPoints.notifications.create, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: NotificationType.LOAN,
            title: `Loan approval required`,
            message: `A loan application requires your approval`,
            data: {
              loanId: transactionId,
              requiresAction: true,
              role: "TREASURER",
            },
            recipientRole: "TREASURER",
          }),
        });
      }

      toast.success("Loan approved as guarantor successfully");
      return data;
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan");
      return null;
    }
  };

  const approveAsTreasurer = async (transactionId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        endPoints.transactions.treasurerApproval(transactionId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve loan");
      }

      // Notify secretary for next approval
      await fetch(endPoints.notifications.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: NotificationType.LOAN,
          title: `Loan approval required`,
          message: `A loan application requires your approval`,
          data: {
            loanId: transactionId,
            requiresAction: true,
            role: "SECRETARY",
          },
          recipientRole: "SECRETARY",
        }),
      });

      toast.success("Loan approved by treasurer successfully");
      return response.json();
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan");
      return null;
    }
  };

  const approveAsSecretary = async (transactionId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        endPoints.transactions.secretaryApproval(transactionId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve loan");
      }

      // Notify chairperson for final approval
      await fetch(endPoints.notifications.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: NotificationType.LOAN,
          title: `Final loan approval required`,
          message: `A loan application requires your final approval`,
          data: {
            loanId: transactionId,
            requiresAction: true,
            role: "CHAIRPERSON",
          },
          recipientRole: "CHAIRPERSON",
        }),
      });

      toast.success("Loan approved by secretary successfully");
      return response.json();
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan");
      return null;
    }
  };

  const approveAsChairperson = async (transactionId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        endPoints.transactions.chairpersonApproval(transactionId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve loan");
      }

      const responseData = await response.json();

      // Notify loan applicant of final approval
      await fetch(endPoints.notifications.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: NotificationType.LOAN,
          title: `Loan approved`,
          message: `Your loan application has been approved`,
          data: {
            loanId: transactionId,
            status: "APPROVED",
          },
          recipientId: responseData.data.applicantId,
          user: { connect: { id: responseData.data.applicantId } },
        }),
      });

      toast.success("Loan approved by chairperson successfully");
      return responseData;
    } catch (error) {
      console.error("Error approving loan:", error);
      toast.error("Failed to approve loan");
      return null;
    }
  };

  const approveTransactionAsTreasurer = async (transactionId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        endPoints.transactions.transactionTreasurerApproval(transactionId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve transaction");
      }

      const data = await response.json();
      toast.success("Transaction approved as treasurer successfully");
      return data;
    } catch (error) {
      console.error("Error approving transaction as treasurer:", error);
      toast.error("Failed to approve transaction");
      return null;
    }
  };

  const approveTransactionAsSecretary = async (transactionId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        endPoints.transactions.transactionSecretaryApproval(transactionId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve transaction");
      }

      const data = await response.json();
      toast.success("Transaction approved as secretary successfully");
      return data;
    } catch (error) {
      console.error("Error approving transaction as secretary:", error);
      toast.error("Failed to approve transaction");
      return null;
    }
  };

  const approveTransactionAsChairperson = async (transactionId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(
        endPoints.transactions.transactionChairpersonApproval(transactionId),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve transaction");
      }

      const data = await response.json();
      toast.success("Transaction approved as chairperson successfully");
      return data;
    } catch (error) {
      console.error("Error approving transaction as chairperson:", error);
      toast.error("Failed to approve transaction");
      return null;
    }
  };

  const approveTransaction = async (
    transactionId: string,
    approvalType: string,
    transactionType?: string
  ) => {
    try {
      const token = await getToken();
      let endpoint = "";

      // Use role-specific endpoints for non-loan transactions
      if (transactionType !== TransactionType.LOAN) {
        switch (approvalType) {
          case "Treasurer":
            endpoint =
              endPoints.transactions.transactionTreasurerApproval(
                transactionId
              );
            break;
          case "Secretary":
            endpoint =
              endPoints.transactions.transactionSecretaryApproval(
                transactionId
              );
            break;
          case "ChamaAdmin":
            endpoint =
              endPoints.transactions.transactionChairpersonApproval(
                transactionId
              );
            break;
          default:
            throw new Error("Invalid approval type");
        }
      } else {
        // Use loan-specific endpoints for loan transactions
        switch (approvalType) {
          case "Treasurer":
            endpoint = endPoints.transactions.treasurerApproval(transactionId);
            break;
          case "Secretary":
            endpoint = endPoints.transactions.secretaryApproval(transactionId);
            break;
          case "ChamaAdmin":
            endpoint =
              endPoints.transactions.chairpersonApproval(transactionId);
            break;
          default:
            throw new Error("Invalid approval type");
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to approve transaction");
      }

      const data = await response.json();
      toast.success(`Transaction approved as ${approvalType} successfully`);

      // Notification for the next person in the workflow
      if (approvalType === "Treasurer") {
        // After treasurer approval, secretary needs to approve
        try {
          await fetch(endPoints.notifications.create, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: transactionType
                ? getNotificationTypeForTransaction(
                    transactionType as TransactionType
                  )
                : NotificationType.TRANSACTION,
              message: `A ${
                transactionType?.toLowerCase() || "transaction"
              } requires your approval`,
              data: {
                transactionId: transactionId,
                requiresAction: true,
                role: "SECRETARY",
                transactionType: transactionType,
              },
              recipientRole: "SECRETARY",
            }),
          });
        } catch (error) {
          console.error("Error sending notification to secretary:", error);
        }
      } else if (approvalType === "Secretary") {
        // After secretary approval, chairperson needs to approve
        try {
          await fetch(endPoints.notifications.create, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: transactionType
                ? getNotificationTypeForTransaction(
                    transactionType as TransactionType
                  )
                : NotificationType.TRANSACTION,
              message: `A ${
                transactionType?.toLowerCase() || "transaction"
              } requires your final approval`,
              data: {
                transactionId: transactionId,
                requiresAction: true,
                role: "CHAIRPERSON",
                transactionType: transactionType,
              },
              recipientRole: "CHAIRPERSON",
            }),
          });
        } catch (error) {
          console.error("Error sending notification to chairperson:", error);
        }
      }

      // If approved as Chairperson, the transaction is now completed
      if (approvalType === "ChamaAdmin") {
        toast.success("Transaction is now fully approved and completed");

        // Create a properly typed notification for the transaction owner when it's fully approved
        if (data.data?.userId) {
          try {
            // Use the correct notification type based on transaction type
            const notificationType = transactionType
              ? getNotificationTypeForTransaction(
                  transactionType as TransactionType
                )
              : NotificationType.TRANSACTION;

            await fetch(endPoints.notifications.create, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                type: notificationType,
                message: `Your ${
                  transactionType?.toLowerCase() || "transaction"
                } has been fully approved`,
                data: {
                  transactionId: transactionId,
                  status: "APPROVED",
                  transactionType: transactionType,
                },
                recipientId: data.data.userId,
              }),
            });
          } catch (notifyError) {
            console.error(
              "Error sending completion notification:",
              notifyError
            );
            // Don't fail the whole approval if notification sending fails
          }
        }
      }

      return data;
    } catch (error) {
      console.error("Error approving transaction:", error);
      toast.error("Failed to approve transaction");
      return null;
    }
  };

  // New function to reject transactions with reason
  const rejectTransaction = async (
    transactionId: string,
    rejectionReason: string,
    transactionType?: string
  ) => {
    try {
      const token = await getToken();

      // Use the general reject endpoint for all transaction types
      const rejectUrl = endPoints.transactions.rejectTransaction(transactionId);

      const response = await fetch(rejectUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reason: rejectionReason,
          transactionType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject transaction");
      }

      const data = await response.json();
      toast.success(`Transaction rejected successfully`);

      // Notify the transaction creator/owner that it was rejected
      if (data.data?.userId) {
        try {
          const notificationType = transactionType
            ? getNotificationTypeForTransaction(
                transactionType as TransactionType
              )
            : NotificationType.TRANSACTION;

          await fetch(endPoints.notifications.create, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              type: notificationType,
              title: `${
                transactionType?.toLowerCase() || "Transaction"
              } rejected`,
              message: `Your ${
                transactionType?.toLowerCase() || "transaction"
              } has been rejected`,
              data: {
                transactionId: transactionId,
                status: "REJECTED",
                transactionType: transactionType,
                reason: rejectionReason,
              },
              recipientId: data.data.userId,
              user: { connect: { id: data.data.userId } },
            }),
          });
        } catch (notifyError) {
          console.error("Error sending rejection notification:", notifyError);
        }
      }

      return data;
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      toast.error("Failed to reject transaction");
      return null;
    }
  };

  return useMemo(
    () => ({
      transactions,
      getPaymentMethods,
      makeContribution,
      getAll,
      addLoanAndExpense,
      applyLoan,
      approveAsGuarantor,
      approveAsTreasurer,
      approveAsSecretary,
      approveAsChairperson,
      approveTransaction,
      rejectTransaction,
      approveTransactionAsTreasurer,
      approveTransactionAsSecretary,
      approveTransactionAsChairperson,
    }),
    [transactions]
  );
}
