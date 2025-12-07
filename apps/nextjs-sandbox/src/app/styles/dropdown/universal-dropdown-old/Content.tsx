"use client";

import { useState } from "react";
import { Dropdown } from "./dropdown/Dropdown";

enum ApprovalType {
	PENDING = "PENDING",
	APPROVED = "APPROVED",
	REJECTED = "REJECTED",
}

type Contact = {
	name: string;
	email: string;
};

/**
 * the order is intentionally set to be unsorted
 */
const users: Contact[] = [
	{
		name: "Alice",
		email: "alice@example.com",
	},
	{
		name: "Charlie",
		email: "charlie@example.com",
	},
	{
		name: "Bob",
		email: "bob@example.com",
	},
];

const Content = () => {
	const [approval, setApproval] = useState<ApprovalType | undefined>();
	const [hoverApproval, setHoverApproval] = useState<
		ApprovalType | undefined
	>(undefined);
	const [approvalWithDefault, setApprovalWithDefault] = useState<
		ApprovalType | undefined
	>(ApprovalType.PENDING);

	const [user, setUser] = useState<Contact | undefined>(undefined);
	const [hoverUser, setHoverUser] = useState<Contact | undefined>(undefined);
	const [userWithDefault, setUserWithDefault] = useState<Contact | undefined>(
		{
			name: "Alice",
			email: "alice@example.com",
		}
	);

	return (
		<div
			className="flex flex-col p-4 gap-4
			text-white/80
			bg-black/80"
		>
			<div className="text-lg">Universal Dropdown</div>
			<div>
				<div>
					string-like data (string enum, string union type...),
					regular mode
				</div>
				<div className="flex items-center gap-10">
					<Dropdown<ApprovalType>
						kind="string"
						mode="regular"
						selected={approval}
						setSelected={setApproval}
						setHover={setHoverApproval}
						options={[
							ApprovalType.PENDING,
							ApprovalType.APPROVED,
							ApprovalType.REJECTED,
						]}
						placeholder=""
					/>
					<div className="text-white/30">{hoverApproval}</div>
				</div>
			</div>
			<div>
				<div>
					string-like data (string enum, string union type...), search
					mode
				</div>
				<Dropdown<ApprovalType>
					kind="string"
					mode="search"
					selected={approval}
					setSelected={setApproval}
					options={[
						ApprovalType.PENDING,
						ApprovalType.APPROVED,
						ApprovalType.REJECTED,
					]}
					placeholder=""
				/>
			</div>
			<div>
				<div>object-like data, regular mode</div>
				<Dropdown<Contact>
					kind="object"
					mode="regular"
					selected={user}
					setSelected={setUser}
					options={users}
					label={{ primaryKey: "name", secondaryKey: "email" }}
					placeholder=""
					sortBy="name"
				/>
			</div>
			<div>
				<div>object-like data, search mode</div>
				<div className="flex items-center gap-10">
					<Dropdown<Contact>
						kind="object"
						mode="search"
						selected={user}
						setSelected={setUser}
						setHover={setHoverUser}
						options={users}
						label={{ primaryKey: "name", secondaryKey: "email" }}
						placeholder=""
						sortBy="name"
					/>
					<div className="text-white/30">
						{hoverUser?.name} {hoverUser?.email}
					</div>
				</div>
			</div>
			<div> ============= with default value ============= </div>
			<div>
				<div>
					string-like data (string enum, string union type...),
					regular mode, with default value
				</div>
				<div className="flex items-center gap-10">
					<Dropdown<ApprovalType>
						kind="string"
						mode="regular"
						selected={approvalWithDefault}
						setSelected={setApprovalWithDefault}
						setHover={setHoverApproval}
						options={[
							ApprovalType.PENDING,
							ApprovalType.APPROVED,
							ApprovalType.REJECTED,
						]}
						placeholder=""
					/>
					<div className="text-white/30">{hoverApproval}</div>
				</div>
			</div>
			<div>
				<div>
					string-like data (string enum, string union type...), search
					mode
				</div>
				<Dropdown<ApprovalType>
					kind="string"
					mode="search"
					selected={approvalWithDefault}
					setSelected={setApprovalWithDefault}
					options={[
						ApprovalType.PENDING,
						ApprovalType.APPROVED,
						ApprovalType.REJECTED,
					]}
					placeholder=""
				/>
			</div>
			<div>
				<div>object-like data, regular mode, with default value</div>
				<Dropdown<Contact>
					kind="object"
					mode="regular"
					selected={userWithDefault}
					setSelected={setUserWithDefault}
					options={users}
					label={{ primaryKey: "name", secondaryKey: "email" }}
					placeholder=""
					sortBy="name"
				/>
			</div>
			<div>
				<div>object-like data, search mode, with default value</div>
				<div className="flex items-center gap-10">
					<Dropdown<Contact>
						kind="object"
						mode="search"
						selected={userWithDefault}
						setSelected={setUserWithDefault}
						setHover={setHoverUser}
						options={users}
						label={{ primaryKey: "name", secondaryKey: "email" }}
						placeholder=""
						sortBy="name"
					/>
					<div className="text-white/30">
						{hoverUser?.name} {hoverUser?.email}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Content;
