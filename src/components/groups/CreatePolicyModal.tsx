"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; type: string; content: any }) => Promise<any> | void;
}

export default function CreatePolicyModal({ isOpen, onClose, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [type, setType] = useState("GENERAL");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      let parsed: any = {};
      try { parsed = JSON.parse(content); } catch { parsed = { text: content }; }
      await onSubmit({ name, type, content: parsed });
      setName("");
      setContent("");
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
          <DialogTitle>Create Policy</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input placeholder="Policy name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Select onValueChange={(v: any) => setType(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GENERAL">GENERAL</SelectItem>
                <SelectItem value="LOAN">LOAN</SelectItem>
                <SelectItem value="CONTRIBUTION">CONTRIBUTION</SelectItem>
                <SelectItem value="FINE">FINE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Textarea placeholder="Policy content (JSON or text)" value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-400 text-black" disabled={loading}>{loading ? 'Creating...' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
