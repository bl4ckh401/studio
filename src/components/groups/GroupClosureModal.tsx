"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { closureDate: string; reason: string }) => Promise<any> | void;
}

export default function GroupClosureModal({ isOpen, onClose, onSubmit }: Props) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ closureDate: date, reason });
      setDate("");
      setReason("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>Initiate Group Closure</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <Textarea placeholder="Reason for closure" value={reason} onChange={(e) => setReason(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button type="submit" variant="destructive" className="text-white">{loading ? 'Submitting...' : 'Initiate Closure'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
