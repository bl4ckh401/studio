"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Props {
  documents: Array<any>;
  onView?: (doc: any) => void;
}

export default function DocumentList({ documents = [], onView }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No documents found
              </TableCell>
            </TableRow>
          )}
          {documents.map((doc: any) => (
            <TableRow key={doc.id || doc.title}>
              <TableCell>{doc.title || doc.name}</TableCell>
              <TableCell>{doc.type || doc.documentType || "GENERAL"}</TableCell>
              <TableCell>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {onView && (
                    <Button variant="ghost" size="sm" onClick={() => onView(doc)}>
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
