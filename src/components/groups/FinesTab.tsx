"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TransactionApprovalActions from "./TransactionApprovalActions";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AddFine from "./AddFine";

import { getMemberDisplay } from "./TransactionColumns";
import { formatCurrency, formatDateWithTime } from "@/lib/utils";
import { useTransaction } from "@/hooks/use-transaction";
import { TransactionType } from "@/app/types";

interface Props {
  group: any;
}

export default function FinesTab({ group }: Props) {

  const { getAll } = useTransaction();
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(10);

  async function getData() {
      if (!group) return;
      await getAll(group.id, offset, limit, TransactionType.FINE);
    }

  const displayName = (val: any) => {
    if (val == null) return "Unknown";
    if (typeof val === "string") return val;
    if (typeof val === "number") return String(val);
    if (typeof val === "object") {
      return val.name ?? val.fullName ?? val.firstName ?? JSON.stringify(val);
    }
    return String(val);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddFine
          group={group}
          getAll={async () => {
            /* parent handles refresh */
          }}
        />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(group?.finesData ? group.finesData : []) &&
              (group?.finesData || []).map((fine: any) => (
                <TableRow key={fine.id}>
                  <TableCell>{formatDateWithTime(fine.date)}</TableCell>
                  <TableCell className="font-medium">
                    {getMemberDisplay(fine, group)}
                  </TableCell>
                  <TableCell>{displayName(fine.reason)}</TableCell>
                  <TableCell>
                    {formatCurrency(Number(fine.amount ?? 0))}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        fine.status === "Paid" ? "secondary" : "destructive"
                      }
                      className={
                        fine.status === "Paid"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }
                    >
                      {fine.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TransactionApprovalActions
                      transaction={fine}
                      getAll={getData}
                      currentMembership={group?.members?.find(
                        (m: any) => m.userId === fine.userId
                      )}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
