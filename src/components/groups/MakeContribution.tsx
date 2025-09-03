"use client";

import { useEffect, useState } from "react";
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
import { Group, GroupMember } from "@/app/types/api";
import { AlertCircle, Info, Plus } from "lucide-react";
import { useTransaction } from "@/hooks/use-transaction";
import toast from "react-hot-toast";
import { useLoading } from "@/context/LoadingContext";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuthStore } from "@/store/authStore";
import { canPerformFinancialActions, isOfficeBearer } from "@/lib/permissions";

interface PaymentFormData {
  amount: number;
  description: string;
  paymentMethod: string;
  phone: string;
  userId?: string; // Add userId field for selecting which member to make contribution for
}

export default function MakeContribution({
  group,
  getAll,
}: {
  group: Group;
  getAll: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const { setLoading } = useLoading();
  const { meAuth } = useAuth();
  const storeUser = useAuthStore((state) => state.user);

  // For treasurer, default to blank; for regular user, default to self
  const isTreasurer =
    group.members.find((member) => member.userId === storeUser?.id)?.role?.name?.toLowerCase() ===
      "treasurer" ||
    storeUser?.id === group.createdById;
  const [selectedMember, setSelectedMember] = useState<string>(
    isTreasurer ? "" : storeUser?.id || ""
  );

  // Find current user's membership
  const currentUserMembership = group.members.find((member) => member.userId === storeUser?.id);

  // Check if user can make contributions based on their role
  // Only office bearers (treasurers, secretaries, chairpersons) or the group creator can make contributions
  const canMakeContributions = canPerformFinancialActions(
    currentUserMembership?.role?.name,
    storeUser?.id,
    group.createdById
  );

  const [paymentMethods, setPaymentMethods] = useState<Array<{ label: string; value: string }>>([]);

  const { getPaymentMethods, makeContribution } = useTransaction();

  useEffect(() => {
    setLoading(true);
    getData();
  }, []);

  async function getData() {
    const methods = await getPaymentMethods();

    if (methods) {
      setPaymentMethods(methods);
    }
    setLoading(false);
  }

  // Check if user is a treasurer
  const isTreasurerCheck =
    currentUserMembership?.role?.name.toLowerCase() === "treasurer".toLowerCase() ||
    storeUser?.id === group.createdById;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData>({
    defaultValues: {
      userId: isTreasurer ? "" : storeUser?.id || "",
    },
  });

  // Watch the payment method to show appropriate messages
  const watchPaymentMethod = watch("paymentMethod");
  const onSubmit = async (data: PaymentFormData) => {
    // Always use selectedMember as the userId
    const userIdToSend = selectedMember;
    if (!userIdToSend && isTreasurer) {
      toast.error("Please select a member for this contribution");
      return;
    }
    setLoading(true);
    try {
      const userRole =
        group.members.find((member) => member.userId === storeUser?.id)?.role?.name.toLowerCase() || "";
      const requiresApproval = userRole === "treasurer" || storeUser?.id === group.createdById;
      const bodyRequest = {
        ...data,
        groupId: group.id,
        userId: userIdToSend,
        isManualEntry: isTreasurer ? userIdToSend !== storeUser?.id : false,
        userRole: userRole,
        requiresApproval: requiresApproval,
      };
      // Log the userId and bodyRequest for debugging
      await makeContribution(bodyRequest);
      await getAll();
      setOpen(false); // Close modal after submit
      reset(); // Reset form after submission
      setSelectedMember(isTreasurer ? "" : storeUser?.id || ""); // Reset selected member
      setSelectedPaymentMethod(""); // Reset payment method

      const isTreasurerOrAdmin =
        userRole === "treasurer" || storeUser?.id === group.createdById;
      if (isTreasurerOrAdmin) {
        toast.success(
          "Contribution submitted and pending approval from secretary and chairperson",
          { id: "contribution" }
        );
      } else if (watchPaymentMethod === "CASH") {
        toast.success("Cash contribution recorded successfully", {
          id: "contribution",
        });
      } else {
        toast.success("Contribution submitted and waiting for approval", {
          id: "contribution",
        });
      }
    } catch (error) {
      console.error("Error making contribution:", error);
      toast.error("Failed to make contribution", { id: "contribution" });
    } finally {
      setLoading(false);
    }
  };
  // Set up form validation for member selection - IMPORTANT: All hooks must come before any conditional returns
  useEffect(() => {
    if (isTreasurer) {
      // For treasurers, we require member selection
      register("userId", { required: "Member selection is required" });
      // Keep selectedMember and form value in sync
      setValue("userId", selectedMember);
    }
  }, [isTreasurer, register, selectedMember, setValue]);

  // Keep form userId in sync with selectedMember
  useEffect(() => {
    setValue("userId", selectedMember);
  }, [selectedMember, setValue]);

  // Only render the component if the user can make contributions
  if (!canMakeContributions) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          reset();
          setSelectedMember(storeUser?.id || "");
          setSelectedPaymentMethod("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-[#93F1AD] rounded-2xl text-black hover:bg-primary/90 hover:text-white w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Make Contribution
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-[90vh] overflow-y-auto bg-zinc-900 text-white">
        <DialogHeader className="mb-3">
          <DialogTitle>Make Contribution</DialogTitle>{" "}
          <DialogDescription className="text-zinc-400">
            {isTreasurer
              ? "All treasurer contributions require approval from secretary and chairperson before being completed, regardless of payment method."
              : "Cash contributions will be recorded immediately. Other payment methods will require approval from office bearers."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Member Selection - Only for treasurer */}
          {isTreasurer && (
            <div className="space-y-1">
              <Label htmlFor="member">Select Member</Label>{" "}
              <Select
                value={selectedMember}
                onValueChange={(value) => {
                  setSelectedMember(value);
                  setValue("userId", value);
                }}
                required={true}
              >
                <SelectTrigger id="member-select" className="bg-white text-black min-h-[58.18px]">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent className="bg-white text-black">
                  {group.members.map((member) => (
                    <SelectItem key={member.user.id} value={member.user.id}>
                      {member.user.firstName} {member.user.lastName} {" "}
                      {member.user.id === storeUser?.id ? "(You)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-zinc-400">Treasurer must select which member is making the contribution</p>
            </div>
          )}
          {/* Amount */}
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
          {/* Description */}{" "}
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Input
              className="bg-zinc-800 border-zinc-700 text-white min-h-[58.18px]"
              id="description"
              placeholder="Enter description"
              {...register("description")}
            />
          </div>
          {/* Payment Method */}
          <div className="space-y-1">
            <Label htmlFor="paymentMethod">Payment Method</Label>{" "}
            <Select
              onValueChange={(value) => {
                setValue("paymentMethod", value);
                setSelectedPaymentMethod(value);
              }}
            >
              <SelectTrigger id="payment-method" className="bg-white text-black">
                <SelectValue placeholder="Select a payment method" />
              </SelectTrigger>
              <SelectContent className="bg-white text-black">
                {paymentMethods
                  .filter((method) => method.value !== "BANK_TRANSFER" && method.value !== "CARD" && method.value !== "CRYPTO")
                  .map((method, index: number) => (
                    <SelectItem key={index} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>{" "}
          {/* Payment Method Info Alerts */}
          {watchPaymentMethod === "CASH" && !isTreasurer && (
            <Alert className="bg-green-900/30 border-green-600 text-white">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>Cash Payment</AlertTitle>
              <AlertDescription>
                Cash contributions are marked as completed immediately. No
                approval is needed.
              </AlertDescription>
            </Alert>
          )}
          {watchPaymentMethod && isTreasurer && (
            <Alert className="bg-blue-900/30 border-blue-600 text-white">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Approval Required</AlertTitle>
              <AlertDescription>
                All treasurer entries require approval from the secretary and
                chairperson before being completed, regardless of payment
                method.
              </AlertDescription>
            </Alert>
          )}
          {watchPaymentMethod && !isTreasurer && watchPaymentMethod !== "CASH" && (
            <Alert className="bg-blue-900/30 border-blue-600 text-white">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Approval Required</AlertTitle>
              <AlertDescription>
                This contribution will require approval from the secretary and
                chairperson before being completed.
              </AlertDescription>
            </Alert>
          )}
          {/* Phone */}
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              className="bg-zinc-800 border-zinc-700 text-white min-h-[58.18px]"
              placeholder="Enter phone number"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" className="bg-grey-400 hover:bg-grey-300 h-[58.18px] text-white" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-green-400 hover:bg-green-500 h-[58.18px] text-black rounded-2xl" type="submit">
              Contribute
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
