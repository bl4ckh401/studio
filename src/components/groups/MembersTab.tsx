"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Group, GroupMember, Role } from "@/app/types/api";
import { useAuthStore } from "@/store/authStore";
import { useRole } from "@/hooks/use-role";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Plus } from "lucide-react";
import AddGroupMember from "./AddGroupMember";

export default function MembersTab({ group }: { group: Group }) {
  const [members, setMembers] = useState<GroupMember[]>(group.members || []);
  const user = useAuthStore((state) => state.user);
  const { getAll: getRoles } = useRole();
  const [roles, setRoles] = useState<Role[]>([]);

  // Find current user's membership
  const currentUserMembership = group.members?.find(
    (member) => member.userId === user?.id
  );

  useEffect(() => {
    // try to fetch roles and enrich members
    (async () => {
      try {
        const roleData = await getRoles();
        if (roleData && Array.isArray(roleData)) {
          setRoles(roleData);
          const updated = (group.members || []).map((m) => {
            if (!m.role && m.roleId) {
              const r = roleData.find((rr) => rr.id === m.roleId);
              if (r) return { ...m, role: r };
            }
            return m;
          });
          setMembers(updated);
        }
      } catch (e) {
        setMembers(group.members || []);
      }
    })();
  }, [group]);

  const formatName = (m: GroupMember) =>
    `${m.user?.firstName ?? ""} ${m.user?.lastName ?? ""}`.trim() ||
    m.user?.email ||
    "Unknown";

  return (
    <div>
      <div className="flex justify-end mb-4">
        <AddGroupMember group={group} getData={async () => { /* parent refresh handled elsewhere */ }} />
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((m) => (
              <TableRow key={m.id ?? m.userId}>
                <TableCell className="flex items-center gap-3 font-medium">
                  <Avatar>
                    <AvatarFallback>
                      {formatName(m).charAt(0) ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>{formatName(m)}</div>
                </TableCell>
                <TableCell>{m.user?.email}</TableCell>
                <TableCell>{m.user?.phone}</TableCell>
                <TableCell>
                  {m.role?.name ??
                    roles.find((r) => r.id === m.roleId)?.name ??
                    "Member"}
                </TableCell>
                <TableCell className="text-right">
                  {m.userId !== user?.id ? (
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  ) : (
                    <span className="text-xs bg-green-500 text-black px-2 py-1 rounded-full">
                      You
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
