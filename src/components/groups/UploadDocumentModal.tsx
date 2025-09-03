"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string; type?: string }) => Promise<any> | void;
}

export default function UploadDocumentModal({ isOpen, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, content, type: 'GENERAL' });
      setTitle("");
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
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Textarea placeholder="Content or URL" value={content} onChange={(e) => setContent(e.target.value)} required />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-400 text-black" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
