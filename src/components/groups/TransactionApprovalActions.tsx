"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useTransaction } from "@/hooks/use-transaction";
import { TransactionType } from "@/app/types/api";
import toast from "react-hot-toast";
import { Check, X } from "lucide-react";

interface Props {
  transaction: any;
  getAll?: any;
  currentMembership?: any;
}

export default function TransactionApprovalActions({
  transaction,
  getAll,
  currentMembership,
}: Props) {
  const { approveTransaction, rejectTransaction } = useTransaction();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showRejectDialog, setShowRejectDialog] = React.useState(false);
  const [rejectionReason, setRejectionReason] = React.useState("");
  const userRole = currentMembership?.role?.name;
  const isTreasurer = userRole?.toLowerCase().includes("treasurer");
  const isSecretary = userRole?.toLowerCase().includes("secretary");
  const isChamaAdmin = userRole === "ChamaAdmin";
  const isChairperson = userRole?.toLowerCase().includes("chamaadmin");
  const canApprove = () => {
    if (transaction.status !== "PENDING") return false;

    if (isTreasurer && !transaction.treasurerApproval) {
      return true;
    }

    // Secretary/Admin can approve if treasurer has approved but secretary hasn't
    if (
      (isSecretary || isChamaAdmin) &&
      transaction.treasurerApproval &&
      !transaction.secretaryApproval
    ) {
      return true;
    }

    // Chairperson needs to approve after treasurer and secretary
    if (
      isChairperson &&
      transaction.treasurerApproval &&
      transaction.secretaryApproval &&
      !transaction.chairpersonApproval
    ) {
      return true;
    }

    return false;
  };
  const getApprovalRole = () => {
    if (isTreasurer) return "Treasurer";
    if (isSecretary || isChamaAdmin) return "Secretary";
    if (isChairperson) return "Chairperson";
    return "";
  };
  // const handleApproveGuarantor = async () => {
  //   setLoading(true);
  //   try {
  //     await txHook.approveAsGuarantor(transaction.id);
  // // Optimistically update local transaction state to reflect guarantor approval
  // setCurrentTransaction((t: any) => ({ ...t, guarantors: (t?.guarantors || []).map((g: any) => g.userId === user?.id ? { ...g, hasApproved: true, status: 'APPROVED' } : g) }));
  // // Refresh parent data a few times to ensure the backend state change is reflected
  //     if (onSuccess) {
  //       const refresh = async () => {
  //         try {
  //           await onSuccess();
  //         } catch (e) {
  //           // ignore
  //         }
  //       };
  //       await refresh();
  //       // additional attempts with short delays
  //       await new Promise((r) => setTimeout(r, 500));
  //       await refresh();
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleApproveTreasurer = async () => {
  //   setLoading(true);
  //   try {
  //     if (transaction.transactionType === TransactionType.LOAN) {
  //       await txHook.approveAsTreasurer(transaction.id);
  //     } else {
  // await txHook.approveTransaction(transaction.id, 'Treasurer', transaction.transactionType, group?.id);
  //     }
  // // Optimistically mark treasurer approved
  // setCurrentTransaction((t: any) => ({ ...t, treasurerApproved: true, treasurerApproval: true }));
  // if (onSuccess) {
  //       const refresh = async () => {
  //         try {
  //           await onSuccess();
  //         } catch (e) {}
  //       };
  //       await refresh();
  //       await new Promise((r) => setTimeout(r, 500));
  //       await refresh();
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleApproveSecretary = async () => {
  //   setLoading(true);
  //   try {
  //     if (transaction.transactionType === TransactionType.LOAN) {
  //       await txHook.approveAsSecretary(transaction.id);
  //     } else {
  // await txHook.approveTransaction(transaction.id, 'Secretary', transaction.transactionType, group?.id);
  //     }
  // // Optimistically mark secretary approved
  // setCurrentTransaction((t: any) => ({ ...t, secretaryApproved: true, secretaryApproval: true }));
  // if (onSuccess) {
  //       const refresh = async () => {
  //         try {
  //           await onSuccess();
  //         } catch (e) {}
  //       };
  //       await refresh();
  //       await new Promise((r) => setTimeout(r, 500));
  //       await refresh();
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleApproveChair = async () => {
  //   setLoading(true);
  //   try {
  //     if (transaction.transactionType === TransactionType.LOAN) {
  //       await txHook.approveAsChairperson(transaction.id);
  //     } else {
  //       // mapped name expected by approveTransaction is 'ChamaAdmin'
  // await txHook.approveTransaction(transaction.id, 'ChamaAdmin', transaction.transactionType, group?.id);
  //     }
  // // Optimistically mark chair approved and set status to completed
  // setCurrentTransaction((t: any) => ({ ...t, chairpersonApproved: true, chairpersonApproval: true, status: 'COMPLETED', transactionStatus: 'COMPLETED' }));
  // if (onSuccess) {
  //       const refresh = async () => {
  //         try {
  //           await onSuccess();
  //         } catch (e) {}
  //       };
  //       await refresh();
  //       await new Promise((r) => setTimeout(r, 500));
  //       await refresh();
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approveTransaction(
        transaction.id,
        getApprovalRole(),
        transaction.transactionType
      );
      getAll(); // Refresh the list
    } catch (error) {
      console.error("Error approving transaction:", error);
      toast.error("Failed to approve transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setIsProcessing(true);
    try {
      await rejectTransaction(
        transaction.id,
        rejectionReason,
        transaction.transactionType
      );
      setShowRejectDialog(false);
      setRejectionReason("");
      getAll(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      toast.error("Failed to reject transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!canApprove()) return null;

  return (
    <>
      <div className="flex gap-2">
        <Button
          onClick={handleApprove}
          disabled={isProcessing}
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => setShowRejectDialog(true)}
          disabled={isProcessing}
          size="sm"
          variant="destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {showRejectDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-white">Reject Transaction</h3>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Please provide a reason for rejection..."
              className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white min-h-[100px]"
            />
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleReject}
                disabled={isProcessing || !rejectionReason.trim()}
                variant="destructive"
              >
                Confirm Reject
              </Button>
              <Button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                }}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
