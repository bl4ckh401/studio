"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useGoals } from "@/hooks/use-goals";
import toast from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { DialogDescription } from "@/components/ui/dialog";
import { CardDescription } from "@/components/ui/card";
import { Trash2, Pencil, Info } from "lucide-react";
import { formatDateWithTime } from "@/lib/utils";

interface GoalsTabProps {
  group: any;
}

export default function GoalsTab({ group }: GoalsTabProps) {
  const goalsHook = useGoals();
  const [goals, setGoals] = useState<any[]>(group?.goals || []);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    target: "",
    deadline: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setGoals(group?.goals || []);
  }, [group?.goals]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleSubmit = async () => {
    if (!group?.id) return;
    setSaving(true);
    try {
      // client-side validation
      if (!form.name || form.name.trim() === "") {
        toast.error("Goal title is required");
        setSaving(false);
        return;
      }

      // map local form to API expected fields
      const payload = {
        title: form.name,
        targetAmount: Number(form.target) || 0,
        deadline: form.deadline,
        description: form.note,
      } as any;

      await goalsHook.createGoal(group.id, payload);
      // refresh
      const refreshed = await goalsHook.getGroupGoals(group.id);
      setGoals(refreshed || refreshed?.data || []);
      close();
      setForm({ name: "", target: "", deadline: "", note: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            {/* <CardTitle className="text-2xl">Group Goals</CardTitle> */}
            <div className="flex gap-2">
              <Button
                className="bg-green-400 hover:bg-green-500 text-black"
                onClick={open}
              >
                Add Goal
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {goals.length === 0 && (
            <Card className="bg-zinc-800 p-4 rounded-xl">
              <CardContent className="text-sm text-muted-foreground p-6">
                No goals yet. Create a new goal to get started.
              </CardContent>
            </Card>
          )}

          {goals.map((goal: any) => {
            const percent = Math.round(
              ((goal.current || 0) / Math.max(goal.target || 1, 1)) * 100
            );
            return (
              <Card key={goal.id} className="bg-[var(--card-bg)] p-4 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-[var(--text-color)]">
                    {goal.title}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log("edit", goal)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log("delete", goal.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-[var(--text-color)]">
                    <span>Target:</span>
                    <span>
                      {new Intl.NumberFormat("en-KE", {
                        style: "currency",
                        currency: "KES",
                      }).format(goal.targetAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--text-color)]">
                    <span>Current:</span>
                    <span>
                      {new Intl.NumberFormat("en-KE", {
                        style: "currency",
                        currency: "KES",
                      }).format(goal.currentAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--text-color)]">
                    <span>Progress:</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="flex justify-between text-sm text-[var(--text-color)]">
                    <span>Deadline:</span>
                    <span>{formatDateWithTime(goal.deadline)}</span>
                  </div>

                  <div className="mt-2">
                    <Progress
                      value={
                        (goal.current / Math.max(goal.target || 1, 1)) * 100
                      }
                      className="h-3 rounded-md"
                    />
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        goal.status === "ACHIEVED"
                          ? "bg-green-500/10 text-green-500"
                          : goal.status === "FAILED"
                          ? "bg-red-500/10 text-red-500"
                          : goal.status === "PENDING_APPROVAL"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-yellow-500/10 text-yellow-500"
                      }`}
                    >
                      {goal.status === "PENDING_APPROVAL"
                        ? "Pending Approval"
                        : goal.status === "IN_PROGRESS"
                        ? "In Progress"
                        : goal.status}
                    </div>

                    <div className="text-sm text-[var(--text-color)]">{percent}%</div>
                  </div>

                  {goal.description && (
                    <p className="text-sm text-[var(--text-color)] mt-2">
                      {goal.description}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Create Goal Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-[var(--text-color)]">
          <DialogHeader>
            <DialogTitle className="text-[var(--text-color)]">Create New Goal</DialogTitle>
            <DialogDescription className="text-[var(--text-color)]">
              Set a new goal for your group
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[var(--text-color)]">
                Title
              </Label>
              <Input
                id="name"
                value={form.name}
                className="text-[var(--text-color)]"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target" className="text-[var(--text-color)]">
                Target Amount
              </Label>
              <Input
                id="target"
                type="number"
                value={form.target}
                className="text-[var(--text-color)]"
                onChange={(e) => setForm({ ...form, target: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-[var(--text-color)]">
                Deadline
              </Label>
              <Input
                id="deadline"
                type="date"
                value={form.deadline}
                className="text-[var(--text-color)]"
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note" className="text-[var(--text-color)]">
                Description
              </Label>
              <Textarea
                id="note"
                value={form.note}
                className="text-[var(--text-color)]"
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <div className="w-full flex justify-end">
              <Button
                className="bg-green-400 hover:bg-green-500 text-black"
                onClick={handleSubmit}
                disabled={saving}
              >
                Create Goal
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
