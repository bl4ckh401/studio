"use client";

export function getMemberDisplay(row: any, group: any) {
  if (!row) return "Unknown";

  // If row already has a member object with a name
  if (row.member && (row.member.name || row.member.fullName)) {
    return row.member.name ?? row.member.fullName;
  }

  // Try to resolve via userId against group members
  const userId = row.userId ?? row.user?.id ?? row.memberId ?? row.userId;
  if (userId && group?.members && Array.isArray(group.members)) {
    const found = group.members.find((m: any) => String(m.userId) === String(userId));
    if (found) {
      const u = found.user ?? found;
      if (u) return (u.firstName ? `${u.firstName} ${u.lastName ?? ""}`.trim() : (u.name ?? u.email ?? u.id ?? String(found.userId)));
    }
  }

  // Fallbacks from row shape
  if (row.user && (row.user.name || row.user.firstName || row.user.email)) {
    const fullName = `${row.user.firstName ?? ""} ${row.user.lastName ?? ""}`.trim();
    return (row.user.name ?? fullName) || row.user.email;
  }

  if (row.memberName) return row.memberName;
  if (row.userName) return row.userName;
  if (row.firstName || row.lastName) return `${row.firstName ?? ""} ${row.lastName ?? ""}`.trim();
  if (row.email) return row.email;

  // Final fallback
  return String(row.userId ?? row.memberId ?? row.id ?? "Unknown").slice(0, 16);
}

// Backwards-compatible placeholder for the old createTransactionColumns function.
// The full original returned column definitions for a DataTable. For now we expose
// a helper to get member display and a small factory that consumers can extend.
import { formatDateWithTime } from "@/lib/utils";

export function createTransactionColumns(options: { group?: any; currentUserMembership?: any; actions?: any } = {}) {
  const { group } = options;

  return [
    {
      key: "date",
      header: "Date",
  cell: (row: any) => formatDateWithTime(row.date || row.createdAt || row.timestamp || "-"),
    },
    {
      key: "user",
      header: "User",
      cell: (row: any) => getMemberDisplay(row, group),
    },
    {
      key: "amount",
      header: "Amount",
      cell: (row: any) => row.amount ?? row.value ?? row.requestedAmount ?? "-",
    },
  ];
}
