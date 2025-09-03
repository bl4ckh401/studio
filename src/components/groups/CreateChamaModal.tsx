"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useLoading } from "@/context/LoadingContext";
import { useGroup } from "@/hooks/use-group";
import { useRole } from "@/hooks/use-role";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Member = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roleId: string;
};

export default function CreateChamaModal({
  triggerLabel = "Create Chama",
  onCreated,
}: {
  triggerLabel?: string;
  onCreated?: () => void;
}) {
  const { setLoading } = useLoading();
  const { create, getTypes } = useGroup();
  const { getAll: getAllRoles } = useRole();

  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  const [types, setTypes] = useState<Array<{ label: string; value: string }>>();
  const [roles, setRoles] = useState<Array<any>>();

  const [group, setGroup] = useState({
    name: "",
    description: "",
    type: "",
    members: [
      {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roleId: "",
      } as Member,
    ],
  });

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const t = await getTypes();
        setTypes(t.data);
        const r = await getAllRoles();
        const filtered = r.filter(
          (role: any) => !["SuperAdmin", "User"].includes(role.name)
        );
        setRoles(filtered);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [open, getTypes, getAllRoles]);

  const handleChange = (field: string, value: string) => {
    setGroup((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleMemberChange = (
    index: number,
    field: keyof Member,
    value: string
  ) => {
    const newMembers = [...group.members];
    newMembers[index] = { ...newMembers[index], [field]: value } as Member;
    setGroup((prev: any) => ({ ...prev, members: newMembers }));
  };

  const handleRoleChange = (index: number, value: string) => {
    const newMembers = [...group.members];
    newMembers[index] = { ...newMembers[index], roleId: value } as Member;
    setGroup((prev: any) => ({ ...prev, members: newMembers }));
  };

  const addMember = () => {
    setGroup((prev: any) => ({
      ...prev,
      members: [
        ...prev.members,
        { firstName: "", lastName: "", email: "", phone: "", roleId: "" },
      ],
    }));
  };

  const removeMember = (index: number) => {
    if (group.members.length <= 1) return;
    setGroup((prev: any) => ({
      ...prev,
      members: prev.members.filter((_: any, i: number) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!group.name.trim()) newErrors.name = "Group name is required";
    if (!group.description.trim())
      newErrors.description = "Description is required";
    if (!group.type) newErrors.type = "Group type is required";

    group.members.forEach((member: Member, index: number) => {
      if (!member.firstName.trim())
        newErrors[`member${index}FirstName`] = "First name is required";
      if (!member.lastName.trim())
        newErrors[`member${index}LastName`] = "Last name is required";
      if (!member.email.trim())
        newErrors[`member${index}Email`] = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(member.email))
        newErrors[`member${index}Email`] = "Invalid email format";
      if (!member.phone.trim())
        newErrors[`member${index}Phone`] = "Phone number is required";
      if (!member.roleId) newErrors[`member${index}Role`] = "Role is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      await create(group.name, group.description, group.type, group.members);
      toast.success("Successfully created a chama group");
      setOpen(false);
      onCreated?.();
    } catch (error) {
      console.error(error);
      toast.error("Error creating group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-4xl sm:max-w-3xl md:max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Chama</DialogTitle>
          <DialogDescription>Create a new Chama Group</DialogDescription>
        </DialogHeader>

        {/* Scrollable content area so long forms fit in viewport */}
        <div className="max-h-[68vh] overflow-y-auto pr-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-white">
                    Chama Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Name *</label>
                    <Input
                      type="text"
                      value={group.name}
                      onChange={(e) => {
                        handleChange("name", e.target.value);
                        setErrors({ ...errors, name: "" });
                      }}
                      placeholder="Enter group name"
                      className={`bg-white border-0 text-black pr-10 mt-1 ${
                        errors.name ? "border-2 border-red-500" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">
                      Description *
                    </label>
                    <Textarea
                      value={group.description}
                      onChange={(e) => {
                        handleChange("description", e.target.value);
                        setErrors({ ...errors, description: "" });
                      }}
                      placeholder="Enter group description"
                      className={`bg-white border-0 text-black pr-10 mt-1 ${
                        errors.description ? "border-2 border-red-500" : ""
                      }`}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Type *</label>
                    <Select
                      value={group.type}
                      onValueChange={(value) => {
                        handleChange("type", value);
                        setErrors({ ...errors, type: "" });
                      }}
                    >
                      <SelectTrigger
                        className={`w-full h-[58.18px] bg-white text-black ${
                          errors.type ? "border-2 border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select Group Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types?.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm text-gray-400">Members *</label>
                    {group.members.map((member: Member, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row gap-2 items-start md:items-center p-4 bg-zinc-800 rounded-lg"
                      >
                        <div className="w-full md:w-1/5">
                          <Input
                            type="text"
                            placeholder="First Name *"
                            value={member.firstName}
                            className={`bg-white border-0 text-black pr-10 ${
                              errors[`member${index}FirstName`]
                                ? "border-2 border-red-500"
                                : ""
                            }`}
                            onChange={(e) => {
                              handleMemberChange(
                                index,
                                "firstName",
                                e.target.value
                              );
                              setErrors({
                                ...errors,
                                [`member${index}FirstName`]: "",
                              });
                            }}
                          />
                          {errors[`member${index}FirstName`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`member${index}FirstName`]}
                            </p>
                          )}
                        </div>
                        <div className="w-full md:w-1/5">
                          <Input
                            type="text"
                            placeholder="Last Name *"
                            value={member.lastName}
                            className={`bg-white border-0 text-black pr-10 ${
                              errors[`member${index}LastName`]
                                ? "border-2 border-red-500"
                                : ""
                            }`}
                            onChange={(e) => {
                              handleMemberChange(
                                index,
                                "lastName",
                                e.target.value
                              );
                              setErrors({
                                ...errors,
                                [`member${index}LastName`]: "",
                              });
                            }}
                          />
                          {errors[`member${index}LastName`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`member${index}LastName`]}
                            </p>
                          )}
                        </div>
                        <div className="w-full md:w-1/5">
                          <Input
                            type="text"
                            placeholder="Phone Number *"
                            value={member.phone}
                            className={`bg-white border-0 text-black pr-10 ${
                              errors[`member${index}Phone`]
                                ? "border-2 border-red-500"
                                : ""
                            }`}
                            onChange={(e) => {
                              handleMemberChange(
                                index,
                                "phone",
                                e.target.value
                              );
                              setErrors({
                                ...errors,
                                [`member${index}Phone`]: "",
                              });
                            }}
                          />
                          {errors[`member${index}Phone`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`member${index}Phone`]}
                            </p>
                          )}
                        </div>
                        <div className="w-full md:w-1/5">
                          <Input
                            type="email"
                            placeholder="Email *"
                            value={member.email}
                            className={`bg-white border-0 text-black pr-10 ${
                              errors[`member${index}Email`]
                                ? "border-2 border-red-500"
                                : ""
                            }`}
                            onChange={(e) => {
                              handleMemberChange(
                                index,
                                "email",
                                e.target.value
                              );
                              setErrors({
                                ...errors,
                                [`member${index}Email`]: "",
                              });
                            }}
                          />
                          {errors[`member${index}Email`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`member${index}Email`]}
                            </p>
                          )}
                        </div>
                        <div className="w-full md:w-1/5">
                          <Select
                            value={member.roleId}
                            onValueChange={(value) => {
                              handleRoleChange(index, value);
                              setErrors({
                                ...errors,
                                [`member${index}Role`]: "",
                              });
                            }}
                          >
                            <SelectTrigger
                              className={`w-full h-[58.18px] bg-white text-black ${
                                errors[`member${index}Role`]
                                  ? "border-2 border-red-500"
                                  : ""
                              }`}
                            >
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles?.map((role: any) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors[`member${index}Role`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`member${index}Role`]}
                            </p>
                          )}
                        </div>
                        {group.members.length > 1 && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeMember(index)}
                            className="mt-2 md:mt-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      className="mt-2 flex items-center gap-1 bg-green-400 hover:bg-green-500 h-[58.18px] text-black"
                      onClick={addMember}
                    >
                      <Plus className="w-4 h-4" /> Add Member
                    </Button>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={onSubmit}
                      className="w-full bg-green-400 hover:bg-green-500 h-[58.18px] text-black mt-4"
                    >
                      Create Chama
                    </Button>
                  </DialogFooter>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
