"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { getMemberDisplay } from "./TransactionColumns";
import { Button } from "@/components/ui/button";
import { useTransaction } from "@/hooks/use-transaction";
import { TransactionType } from "@/app/types/api";
import { formatCurrency, formatDateWithTime } from "@/lib/utils";
import ApplyLoan from "./ApplyLoan";
import LoanApprovalActions from "./LoanApprovalActions";
import { useAuthStore } from "@/store/authStore";

interface Props {
  group: any;
}

export default function LoansTab({ group }: Props) {
  const user = useAuthStore((s) => s.user);
  const { getAll, transactions } = useTransaction();
  const [offset, setOffset] = useState(0);
         const [limit, setLimit] = useState(10); 

  useEffect(() => {
    getData(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  async function getData() {
    if (!group) return;
    await getAll(group.id, offset, limit, TransactionType.LOAN);
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
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4">
        <ApplyLoan group={group} getAll={getData} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Interest</TableHead>
            <TableHead>Applied</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((loan: any) => (
            <TableRow key={loan.id}>
              <TableCell className="font-medium" dataLabel="Applicant">
                {getMemberDisplay(loan, group)} 
              </TableCell>
              <TableCell dataLabel="Amount">
                {formatCurrency(
                  Number(loan.amount ?? loan.requestedAmount ?? 0)
                )}
              </TableCell>
              <TableCell dataLabel="Interest">
                {loan.interestRate
                  ? `${loan.interestRate}%`
                  : loan.interest || "-"}
              </TableCell>
               <TableCell dataLabel="Applied">
                  {formatDateWithTime(loan.date || loan.createdAt || loan.timestamp)} 
               </TableCell>
              <TableCell dataLabel="Due Date">
                {loan.dueDate ?? loan.expectedRepaymentDate ?? "-"}
              </TableCell>
              <TableCell className="text-center" dataLabel="Status">
                {loan.status ?? loan.transactionStatus ?? "-"}
              </TableCell>
              <TableCell className="text-right" dataLabel="Actions">
                <div className="actions">
                  <LoanApprovalActions transaction={loan} getAll={getData} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
