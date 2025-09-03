"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Group, TransactionType } from "@/app/types/api";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { useTransaction } from "@/hooks/use-transaction";
import { endPoints } from "@/lib/api/endpoints";

interface PaymentFormData {
  amount: number;
  description: string;
  duration: number;
}

export default function ApplyLoan({ group, getAll }: { group: Group; getAll?: () => void }) {
  const [open, setOpen] = useState(false);
  const [selectedGuarantors, setSelectedGuarantors] = useState<string[]>([]);
  const [userSavings, setUserSavings] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const { applyLoan } = useTransaction();
  const { getToken, user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({ defaultValues: { amount: 0, description: "", duration: 1 } });

  const amount = Number(watch("amount") || 0);
  const maxLoanAmount = userSavings * 3;

  useEffect(() => {
    const calculateUserSavings = async () => {
      try {
        const token = await getToken();
        const resp = await fetch(
          endPoints.transactions.getGroupTransactions(group.id, 0, 1000, "CONTRIBUTION"),
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resp.ok) throw new Error("Failed to fetch transactions");
        const data = await resp.json();
        const txs = data.data || [];
        const total = txs.reduce((s: number, t: any) => {
          const idMatch = t.userId === user?.id || t.user?.id === user?.id;
          if (idMatch && (t.transactionType === "CONTRIBUTION" || t.type === "CONTRIBUTION") && (t.status === "COMPLETED" || t.transactionStatus === "COMPLETED")) {
            return s + Number(t.amount || 0);
          }
          return s;
        }, 0);
        setUserSavings(total);
      } catch (err) {
        console.error(err);
        setUserSavings(0);
      }
    };
    if (user && group?.id) calculateUserSavings();
  }, [group?.id, user, getToken]);

  const onSubmit = async (data: PaymentFormData) => {
    try {
      setLoading(true);
      // Basic validation
      if (!data.amount || !data.duration || !data.description) {
        toast.error("Please provide all the required fields");
        return;
      }

      if (data.amount > maxLoanAmount) {
        toast.error(`Maximum loan amount allowed is ${maxLoanAmount} (3x your savings)`);
        return;
      }

      if (selectedGuarantors.length === 0 && data.amount > userSavings) {
        toast.error("Please select guarantors for loans exceeding your savings");
        return;
      }

      // Calculate required guarantor amount
      const requiredGuaranteeAmount = Math.max(0, data.amount - userSavings);
      const guarantorShare = selectedGuarantors.length > 0 ? requiredGuaranteeAmount / selectedGuarantors.length : 0;

      // Verify guarantor savings similar to the old implementation: for each selected guarantor
      const guarantorChecks = await Promise.all(
        selectedGuarantors.map(async (guarantorId) => {
          const token = await getToken();

          // Find guarantor's email from the potential guarantors list
          const guarantor = potentialGuarantors.find((m: any) => m.user.id === guarantorId);
          const guarantorEmail = guarantor?.user?.email;

          const calculateGuarantorAvailableFunds = async () => {
            try {
              // 1. Get all contribution transactions for the group
              const contributionsResponse = await fetch(
                endPoints.transactions.getGroupTransactions(group.id, 0, 1000, "CONTRIBUTION"),
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (!contributionsResponse.ok) {
                throw new Error("Failed to fetch contribution transactions");
              }

              const contributionsData = await contributionsResponse.json();
              const contributions = contributionsData.data || [];

              // 2. Calculate total contributions by the guarantor
              const totalContributions = contributions.reduce((sum: number, transaction: any) => {
                if (
                  (transaction.userId === guarantorId || transaction.user?.id === guarantorId) &&
                  transaction.transactionType === "CONTRIBUTION" &&
                  transaction.status === "COMPLETED"
                ) {
                  return sum + transaction.amount;
                }
                return sum;
              }, 0);

              // 3. Get all loan transactions for the group
              const loansResponse = await fetch(
                endPoints.transactions.getGroupTransactions(group.id, 0, 1000, "LOAN"),
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (!loansResponse.ok) {
                throw new Error("Failed to fetch loan transactions");
              }

              const loansData = await loansResponse.json();
              const loans = loansData.data || [];

              // 4. Calculate outstanding loans where the guarantor is the borrower
              const outstandingLoans = loans.reduce((sum: number, loan: any) => {
                if (
                  (loan.userId === guarantorId || loan.user?.id === guarantorId) &&
                  loan.transactionType === "LOAN" &&
                  loan.status !== "REJECTED" &&
                  loan.status !== "COMPLETED"
                ) {
                  return sum + loan.amount;
                }
                return sum;
              }, 0);

              // 5. Calculate amounts locked for guaranteeing other loans
              const lockedForGuaranteeing = loans.reduce((sum: number, loan: any) => {
                if (
                  loan.transactionType === "LOAN" &&
                  loan.status !== "REJECTED" &&
                  loan.status !== "COMPLETED" &&
                  loan.guarantorData &&
                  Array.isArray(loan.guarantorData)
                ) {
                  const isGuarantor = loan.guarantorData.some((g: any) => g.userId === guarantorId || g.email === guarantorEmail);
                  if (isGuarantor) {
                    const guarantorCount = loan.guarantorData.length;
                    const guaranteeAmount = Math.max(0, loan.amount - (loan.userSavings || 0));
                    const guarantorShareForLoan = guarantorCount > 0 ? guaranteeAmount / guarantorCount : 0;
                    return sum + guarantorShareForLoan;
                  }
                }
                return sum;
              }, 0);

              // 6. Calculate available funds
              const availableFunds = totalContributions - outstandingLoans - lockedForGuaranteeing;
              return availableFunds;
            } catch (error) {
              console.error("Error calculating guarantor funds:", error);
              return 0;
            }
          };

          const availableSavings = await calculateGuarantorAvailableFunds();
          const hasSufficientFunds = availableSavings >= (guarantorShare - 0.01);

          return {
            guarantorId,
            guarantorName: guarantor ? `${guarantor.user.lastName} ${guarantor.user.firstName}` : "Unknown",
            guarantorEmail,
            availableSavings,
            guarantorShare,
            hasSufficientFunds,
          };
        })
      );

      const insufficientGuarantors = guarantorChecks.filter((g: any) => !g.hasSufficientFunds);
      if (insufficientGuarantors.length > 0) {
        console.error("Insufficient guarantors:", insufficientGuarantors);
        toast.error(`Some guarantors have insufficient savings: ${insufficientGuarantors.map((g: any) => g.guarantorName).join(", ")}`);
        return;
      }

      // Create an array of guarantor objects with both ID and email
      const guarantorData = selectedGuarantors.map((guarantorId) => {
        const guarantor = potentialGuarantors.find((member: any) => member.user.id === guarantorId);
        return {
          userId: guarantorId,
          email: guarantor?.user.email,
          name: guarantor ? `${guarantor.user.lastName} ${guarantor.user.firstName}` : undefined,
          hasApproved: false,
        };
      });

      const bodyRequest = {
        ...data,
        groupId: group.id,
        guarantorIds: selectedGuarantors,
        guarantorData: guarantorData,
        transactionType: TransactionType.LOAN,
        requiredGuaranteeAmount,
        guarantorShare,
        userSavings,
        maxLoanAmount,
      };

      await applyLoan(bodyRequest);
      toast.success("Loan application submitted successfully");
      if (getAll) getAll();
      setOpen(false);
      reset();
      setSelectedGuarantors([]);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to submit loan application");
    } finally {
      setLoading(false);
    }
  };

  const handleGuarantorSelect = (value: string) => {
    if (!selectedGuarantors.includes(value)) setSelectedGuarantors((s) => [...s, value]);
    else setSelectedGuarantors((s) => s.filter((id) => id !== value));
  };

  const potentialGuarantors = (group?.members || []).filter((m: any) => m.user?.id !== user?.id);

  const filteredGuarantors = potentialGuarantors.filter((m: any) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const name = `${m.user?.firstName || ""} ${m.user?.lastName || ""}`.toLowerCase();
    const email = (m.user?.email || "").toLowerCase();
    return name.includes(q) || email.includes(q);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#93F1AD] rounded-2xl text-black hover:bg-primary/90 hover:text-white w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Apply Loan
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle>Apply for a Loan</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" {...register("amount", { required: true, min: 1 })} />
              {errors.amount && <p className="text-sm text-destructive">{(errors.amount as any).message || 'Amount required'}</p>}
            </div>
            <div>
              <Label htmlFor="duration">Duration (months)</Label>
              <Input id="duration" type="number" {...register("duration", { required: true, min: 1 })} />
              {errors.duration && <p className="text-sm text-destructive">{(errors.duration as any).message || 'Duration required'}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Purpose</Label>
            <Input id="description" {...register("description", { required: true })} />
            {errors.description && <p className="text-sm text-destructive">Description is required</p>}
          </div>

          {amount > userSavings && (
            <div>
              <Label>Guarantors (required)</Label>
              <div className="mt-2">
                <Input
                  placeholder="Search guarantors"
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mb-2"
                />
                <div className="max-h-40 overflow-y-auto border border-border rounded p-2 bg-card">
                  {filteredGuarantors.length === 0 && (
                    <div className="text-sm text-muted-foreground p-2">No guarantors found</div>
                  )}
                  {filteredGuarantors.map((member: any) => (
                    <label key={member.user.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted">
                      <Checkbox
                        checked={selectedGuarantors.includes(member.user.id)}
                        onCheckedChange={() => handleGuarantorSelect(member.user.id)}
                      />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{`${member.user.lastName} ${member.user.firstName}`}</div>
                        <div className="text-xs text-muted-foreground">{member.user.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {selectedGuarantors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">Selected Guarantors:</p>
                    <ul className="list-disc list-inside text-sm text-gray-300">
                      {selectedGuarantors.map((id) => {
                        const member = potentialGuarantors.find((m: any) => m.user?.id === id);
                        return (
                          <li key={id} className="py-1">
                            {member ? `${member.user.lastName} ${member.user.firstName} — ${member.user.email}` : id}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => { setOpen(false); setSelectedGuarantors([]); }}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}