"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { Group, Role } from "@/app/types/api";
import { useGroup } from "@/hooks/use-group";
import { useRole } from "@/hooks/use-role";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { canPerformAdministrativeActions } from "@/lib/permissions";

export default function AddGroupMember({
	group,
	getData: infoData,
}: {
	group: Group;
	getData: () => void;
}) {
	const [open, setOpen] = useState(false);

	const [members, setMembers] = useState<
		Array<{
			firstName: string;
			lastName: string;
			email: string;
			phone: string;
			roleId: string;
		}>
	>([{ firstName: "", lastName: "", email: "", phone: "", roleId: "" }]);

	// Handle Member Change
	const handleMemberChange = (
		index: number,
		field: keyof (typeof members)[0],
		value: string
	) => {
		setMembers((prev) => prev.map((member, i) => (i === index ? { ...member, [field]: value } : member)));
	};

	// Add Member
	const addMember = () => {
		setMembers((prev) => [...prev, { firstName: "", lastName: "", email: "", phone: "", roleId: "" }]);
	};

	// Remove Member
	const removeMember = (index: number) => {
		if (members.length > 1) setMembers((prev) => prev.filter((_, i) => i !== index));
	};

	const [types, setTypes] = useState<Array<{ label: string; value: string }>>([]);
	const { create, getTypes, addMembers } = useGroup();
	const { getAll } = useRole();
	const [roles, setRoles] = useState<Array<Role>>([]);

	useEffect(() => {
		getData();
	}, []);

	async function getData() {
		const types = await getTypes();
		const rls = await getAll();
		setTypes(types.data);

		const filterRoles = rls.filter((role: Role) => !["SuperAdmin", "User"].includes(role.name));
		setRoles(filterRoles);
	}

	const checkForDuplicates = () => {
		const emailsInForm = members.map((member) => member.email.toLowerCase().trim());
		const duplicateFormEmails = emailsInForm.filter((email, index) => email && emailsInForm.indexOf(email) !== index);

		if (duplicateFormEmails.length > 0) {
			toast.error(`You have duplicate emails in your form: ${duplicateFormEmails.join(', ')}`);
			return true;
		}

		const existingEmails = group.members.map((member) => member.user.email.toLowerCase().trim());

		const duplicateWithExisting = members.filter((member) => member.email && existingEmails.includes(member.email.toLowerCase().trim()));

		if (duplicateWithExisting.length > 0) {
			const duplicateEmails = duplicateWithExisting.map((m) => m.email).join(', ');
			toast.error(`These emails already exist in the group: ${duplicateEmails}`);
			return true;
		}

		return false;
	};

	const onSubmit = async () => {
		try {
			const hasEmptyFields = members.some((member) => !member.firstName || !member.lastName || !member.email || !member.phone || !member.roleId);

			if (hasEmptyFields) {
				toast.error("Please fill in all required fields for each member");
				return;
			}

			if (checkForDuplicates()) return;

			await addMembers(group.id!, members);
			setOpen(false);
			setMembers([{ firstName: "", lastName: "", email: "", phone: "", roleId: "" }]);
			infoData();
		} catch (error) {
			console.error("Error adding members:", error);
		}
	};

	const user = useAuthStore((s) => s.user);
	const canManage = canPerformAdministrativeActions(user?.role?.name, user?.id, group.createdById);

	if (!canManage) return null;

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" className="bg-[#93F1AD] rounded-2xl text-black hover:bg-primary/90 hover:text-white w-full sm:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Add
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-zinc-900 text-white">
				<DialogHeader>
					<DialogTitle className="text-white pb-4">Add {group.name} Members</DialogTitle>
					<DialogDescription>
						Add new members to your chama group. Fill in their details including name, contact information and assigned role. You can add multiple members at once.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-3">
					<label className="text-sm text-gray-400">Members</label>
					{members.map((member, index) => (
						<div key={index} className="flex flex-col gap-2 p-4 border rounded-lg">
							<div className="flex gap-3 mb-2">
								<Input type="text" placeholder="First Name" value={member.firstName} className="bg-white border-0 text-black pr-10" onChange={(e) => handleMemberChange(index, "firstName", e.target.value)} />
								<Input type="text" placeholder="Last Name" value={member.lastName} className="bg-white border-0 text-black pr-10" onChange={(e) => handleMemberChange(index, "lastName", e.target.value)} />
							</div>

							<div className="flex gap-3 mb-2">
								<Input type="text" placeholder="Phone Number" value={member.phone} className="bg-white border-0 text-black pr-10" onChange={(e) => handleMemberChange(index, "phone", e.target.value)} />
								<Input type="email" placeholder="Email" value={member.email} className="bg-white border-0 text-black pr-10" onChange={(e) => handleMemberChange(index, "email", e.target.value)} />
							</div>
							<div className="flex gap-3 mb-2 items-center">
								<div className="w-[50%]">
									<label className="text-sm text-gray-400">Role</label>
									<Select value={member.roleId} onValueChange={(value) => handleMemberChange(index, "roleId", value)}>
										<SelectTrigger className="h-[58.18px] bg-white text-black relative">
											<SelectValue placeholder="Select Role" />
										</SelectTrigger>
										<SelectContent position="popper" className="bg-white text-black z-[99]">
											{roles.map((role) => (
												<SelectItem key={role.id} value={role.id}>
													{role.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
							{members.length > 1 && (
								<div className="flex">
									<Button variant="ghost" size="icon" className="bg-red-400 rounded-1xl" onClick={() => removeMember(index)}>
										<Minus className="w-4 h-4" />
									</Button>
								</div>
							)}
						</div>
					))}

					<div className="flex items-center justify-between gap-4 px-4 py-2">
						<Button onClick={(e) => { e.stopPropagation(); addMember(); }} variant="outline" className="w-1/2 h-10 border-[#93F1AD] text-[#93F1AD] hover:bg-[#93F1AD] hover:text-black relative z-10">
							<Plus className="h-4 w-4 mr-2" /> Add Member
						</Button>
						<Button onClick={(e) => { e.stopPropagation(); onSubmit(); }} variant="ghost" className="w-1/2 h-10 bg-[#93F1AD] hover:bg-[#7ad391] text-black relative z-10">
							Submit
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
