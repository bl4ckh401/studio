"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import TransactionApprovalActions from "./TransactionApprovalActions";
import { getMemberDisplay } from "./TransactionColumns";
import { Button } from "@/components/ui/button";
import { useTransaction } from "@/hooks/use-transaction";
import { TransactionType } from "@/app/types/api";
import { useAuthStore } from "@/store/authStore";
import AddExpense from "./AddExpense";
import { canPerformFinancialActions } from "@/lib/finance-permissions";
import { formatCurrency, formatDateWithTime } from "@/lib/utils";

interface Props {
  group: any;
}

export default function ExpensesTab({ group }: Props) {
  const user = useAuthStore((s) => s.user);
  const currentUserMembership = group?.members?.find(
    (m: any) => m.userId === user?.id
  );

  const { getAll, transactions } = useTransaction();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    getData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function getData() {
    if (!group) return;
    await getAll(group.id, offset, limit, TransactionType.EXPENSE);
  }

  const handlePageChange = (newOffset: number) => setOffset(newOffset);

  const displayName = (val: any) => {
    if (!val) return "Unknown";
    if (typeof val === "string") return val;
    if (typeof val === "object")
      return val.name ?? val.fullName ?? val.firstName ?? JSON.stringify(val);
    return String(val);
  };



  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddExpense group={group} getAll={getData} currentUserRole={currentUserMembership?.role?.name} />
      </div>
      <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Item</TableHead>
            {/* <TableHead>Category</TableHead> */}
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((expense: any) => (
            <TableRow key={expense.id}>
              <TableCell dataLabel="Date">
                {formatDateWithTime(expense.date || expense.createdAt || expense.timestamp)}
              </TableCell>
              <TableCell className="font-medium" dataLabel="Payee">
                {getMemberDisplay(expense, group)}
              </TableCell>
              <TableCell className="font-medium" dataLabel="Category">
                {displayName(expense.item || expense.description)}
              </TableCell>
              {/* <TableCell>{expense.category || "-"}</TableCell> */}
              <TableCell className="text-right text-red-500" dataLabel="Amount">
                {formatCurrency(expense.amount ?? 0)}
              </TableCell>
              <TableCell className="text-right" dataLabel="Status">
                {expense.status || expense.transactionStatus || "-"}
              </TableCell>
              <TableCell className="text-right" dataLabel="Actions">
                <TransactionApprovalActions transaction={expense} getAll={getData} currentMembership={currentUserMembership} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
