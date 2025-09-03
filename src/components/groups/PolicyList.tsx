"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Props {
  policies: Array<any>;
  onView?: (p: any) => void;
}

export default function PolicyList({ policies = [], onView }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {policies.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground" dataLabel="Info">
                No policies found
              </TableCell>
            </TableRow>
          )}
          {policies.map((p: any) => (
            <TableRow key={p.id || p.name}>
              <TableCell dataLabel="Name">{p.name}</TableCell>
              <TableCell dataLabel="Type">{p.type}</TableCell>
              <TableCell dataLabel="Date">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-"}</TableCell>
              <TableCell className="text-right" dataLabel="Actions">
                <div className="flex justify-end gap-2 actions">
                  {onView && (
                    <Button variant="ghost" size="sm" onClick={() => onView(p)}>
                      View
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
