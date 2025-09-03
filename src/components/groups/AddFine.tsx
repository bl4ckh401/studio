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

interface FineFormData {
  amount: number;
  description: string;
  paymentMethod?: string;
  phone?: string;
  userId?: string;
}

export default function AddFine({
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
  const user = useAuthStore((state) => state.user);

  // Determine if current user has permission to add fines
  const canAddFine = canPerformFinancialActions(currentUserRole, user?.id, group?.createdById);

  const currentUserMembership = group.members.find((m) => m.userId === user?.id);
  const isTreasurer =
    currentUserMembership?.role?.name?.toLowerCase() === "treasurer".toLowerCase() || user?.id === group.createdById;

  const { addLoanAndExpense } = useTransaction();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FineFormData>();

  useEffect(() => {
    if (isTreasurer) {
      register("userId", { required: "Member selection is required" });
      if (selectedMember) setValue("userId", selectedMember);
    }
  }, [isTreasurer, register, selectedMember, setValue]);

  const onSubmit = async (data: FineFormData) => {
    if (!data.amount || !data.description) {
      toast.error("Please provide all the required fields to proceed");
      return;
    }

    if (!selectedMember && isTreasurer) {
      toast.error("Please select a member for this fine");
      return;
    }

    try {
      toast.loading("Submitting fine for approval...", { id: "fine" });

      const userRole = currentUserMembership?.role?.name || "";

      const bodyRequest = {
        ...data,
        groupId: group.id,
        transactionType: TransactionType.FINE,
        requiresApproval: true,
        userId: selectedMember || user?.id,
        isManualEntry: selectedMember !== user?.id && isTreasurer,
        userRole,
      };

      await addLoanAndExpense(bodyRequest);
      toast.success("Fine submitted for office bearer approval", { id: "fine" });

      getAll && getAll();
      setOpen(false);
      reset();
      setSelectedMember("");
    } catch (error) {
      console.error("Error adding fine:", error);
      toast.error("Failed to submit fine", { id: "fine" });
    }
  };

  if (!canAddFine) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#93F1AD] rounded-2xl text-black hover:bg-primary/90 hover:text-white w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Fine
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto bg-zinc-900 text-white">
        <DialogHeader className="mb-3">
          <DialogTitle>Add Fine</DialogTitle>
          <DialogDescription className="text-zinc-400">
            {isTreasurer
              ? "All treasurer entries require approval from secretary and chairperson before being completed."
              : "All fine entries will require approval from other office bearers."}
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-blue-900/30 border-blue-600 text-white mb-4">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertTitle>Approval Required</AlertTitle>
          <AlertDescription>
            This fine will require approval from the secretary and chairperson before being applied to the member.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="userId">Select Member</Label>
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
            {errors.userId && <p className="text-red-500 text-sm">{errors.userId.message}</p>}
            <p className="text-sm text-zinc-400">
              {isTreasurer ? "Treasurer must select which member this fine is associated with" : "Select the member to fine"}
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
              className="bg-zinc-800 border-zinc-700 text-white min-h-[58.18px]"
              id="amount"
              type="number"
              {...register("amount", { required: "Amount is required", min: 1 })}
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              className="bg-zinc-800 border-zinc-700 text-white min-h-[58.18px]"
              id="description"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" className="bg-grey-400 hover:bg-grey-300 h-[58.18px] text-white" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-400 hover:bg-green-500 h-[58.18px] text-black" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
