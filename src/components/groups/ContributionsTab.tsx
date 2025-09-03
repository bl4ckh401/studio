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
import { getMemberDisplay } from "./TransactionColumns";
import { formatCurrency, formatDateWithTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TransactionApprovalActions from "./TransactionApprovalActions";
import { useTransaction } from "@/hooks/use-transaction";
import { TransactionType } from "@/app/types/api";
import MakeContribution from "./MakeContribution";
import { useAuthStore } from "@/store/authStore";

interface Props {
  group: any;
}

export default function ContributionsTab({ group }: Props) {
  const { getAll, transactions } = useTransaction();
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const user = useAuthStore((s) => s.user);
    const currentUserMembership = group?.members?.find(
      (m: any) => m.userId === user?.id
    );

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    if (!group) return;
    await getAll(group.id, offset, limit, TransactionType.CONTRIBUTION);
  }

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <MakeContribution group={group} getAll={getData} />
      </div>
      <div className="overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Member</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx: any) => (
            <TableRow key={tx.id}>
              <TableCell dataLabel="Date">{formatDateWithTime(tx.date || tx.createdAt || tx.timestamp)}</TableCell>
              <TableCell className="font-medium" dataLabel="Member">
                {getMemberDisplay(tx, group)}
              </TableCell>
              <TableCell className="text-right text-green-500" dataLabel="Amount">
                {formatCurrency(tx.amount || tx.value || 0)}
              </TableCell>
              <TableCell dataLabel="Method">
                {tx.paymentMethod || tx.method || tx.payment?.method || "-"}
              </TableCell>
              <TableCell className="text-right" dataLabel="Status">
                {tx.status || tx.transactionStatus || "-"}
              </TableCell>
              <TableCell className="text-right" dataLabel="Actions">
                <TransactionApprovalActions transaction={tx} getAll={getData} currentMembership={currentUserMembership} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
    </div>
  );
}
