"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Group, TransactionType } from "@/app/types/api";
import { Plus, Info } from "lucide-react";
import { useTransaction } from "@/hooks/use-transaction";
import toast from "react-hot-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/store/authStore";
import { canPerformFinancialActions } from "@/lib/permissions";
import { useRolePermissions } from "@/hooks/use-role-permissions";

interface IncomeFormData {
  amount: number;
  description: string;
  paymentMethod?: string;
  phone?: string;
  userId?: string; // Add userId field for selecting which member the income is associated with
}

export default function AddIncome({
  group,
  getAll,
  currentUserRole,
}: {
  group: Group;
  getAll: () => void;
  currentUserRole?: string;
}) {
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const { addLoanAndExpense } = useTransaction();
  const user = useAuthStore((state) => state.user);

  // Use the permissions hook to check if user can add income
  const permissions = useRolePermissions(group);
  const canAddIncome =
    canPerformFinancialActions(currentUserRole, user?.id, group?.createdById) || permissions.canManageFinances;

  const isTreasurer =
    currentUserRole?.toLowerCase() === "treasurer".toLowerCase() || user?.id === group.createdById;
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IncomeFormData>();

  useEffect(() => {
    if (isTreasurer) {
      register("userId", { required: "Member selection is required" });
      if (selectedMember) setValue("userId", selectedMember);
    }
  }, [isTreasurer, register, selectedMember, setValue]);

  const onSubmit = async (data: IncomeFormData) => {
    if (!data.amount || !data.description) {
      toast.error("Please provide all the required fields to proceed");
      return;
    }

    if (!selectedMember && isTreasurer) {
      toast.error("Please select a member for this income");
      return;
    }

    toast.loading("Processing...", { id: "incomeToast" });
    try {
      const isTreasurerOrAdmin =
        currentUserRole === "TREASURER" || user?.id === group.createdById;

      const result = await addLoanAndExpense({
        amount: data.amount,
        description: data.description,
        groupId: group.id,
        transactionType: TransactionType.INCOME,
        requiresApproval: isTreasurerOrAdmin,
        userRole: currentUserRole || "",
        userId: selectedMember || user?.id,
        isManualEntry: selectedMember !== user?.id && isTreasurerOrAdmin,
      });

      if (result) {
        if (isTreasurerOrAdmin) {
          toast.success(
            "Income added and pending approval from secretary and chairperson",
            { id: "incomeToast" }
          );
        } else {
          toast.success("Successfully added income", { id: "incomeToast" });
        }
        setOpen(false);
        reset();
        setSelectedMember("");
        getAll && getAll();
      } else {
        toast.error("Failed to add income", { id: "incomeToast" });
      }
    } catch (error) {
      console.error("Failed to add income:", error);
      toast.error("Failed to add income", { id: "incomeToast" });
    }
  };

  if (!canAddIncome) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset();
          setSelectedMember("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-[#93F1AD] rounded-2xl text-black hover:bg-primary/90 hover:text-white w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Income
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto bg-zinc-900 text-white">
        <DialogHeader className="mb-3">
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {currentUserRole === "TREASURER" || user?.id === group.createdById
              ? "All treasurer entries require approval from secretary and chairperson before being completed."
              : "Add a new income to the group."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isTreasurer && (
            <div className="space-y-1">
              <Label htmlFor="member">Select Member</Label>
              <Select
                onValueChange={(value) => {
                  setSelectedMember(value);
                }}
                required={true}
              >
                <SelectTrigger id="member-select" className="bg-white text-black min-h-[58.18px]">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {group.members.map((member) => (
                    <SelectItem key={member.user.id} value={member.user.id}>
                      {member.user.firstName} {member.user.lastName} {member.user.id === user?.id ? "(You)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-zinc-400">Treasurer must select which member this income is associated with</p>
            </div>
          )}

          <div className="space-y-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              {...register("amount", { required: "Amount is required", min: 1 })}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[58.18px]"
              placeholder="Enter amount"
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description", { required: "Description is required" })}
              className="bg-zinc-800 border-zinc-700 text-white min-h-[58.18px]"
              placeholder="Enter description"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>
          <Alert className="bg-blue-900/30 border-blue-600 text-white">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle>Note</AlertTitle>
            <AlertDescription>
              {currentUserRole === "TREASURER" || user?.id === group.createdById
                ? "All treasurer entries require approval from secretary and chairperson before being completed."
                : "Adding income will affect the group's balance immediately."}
            </AlertDescription>
          </Alert>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" className="bg-grey-400 hover:bg-grey-300 h-[58.18px] text-white" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-400 hover:bg-green-500 h-[58.18px] text-black rounded-2xl" type="submit">
              Add Income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
