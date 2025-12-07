"use client";

import { Controls, ReactFlow } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

const roles = [
	{
		id: "confidential-lead",
		name: "Confidential Lead",
		superRoleId: null,
		createdAt: "2025-02-28T02:44:00.347Z",
		updatedAt: "2025-02-28T02:44:00.347Z",
		superRole: null,
	},
	{
		id: "confidential",
		name: "Confidential",
		superRoleId: "confidential-lead",
		createdAt: "2025-02-28T02:44:00.347Z",
		updatedAt: "2025-02-28T02:44:00.347Z",
		superRole: {
			id: "confidential-lead",
			name: "Confidential Lead",
			superRoleId: null,
			createdAt: "2025-02-28T02:44:00.347Z",
			updatedAt: "2025-03-25T13:11:20.437Z",
		},
	},
	{
		id: "default",
		name: "Default",
		superRoleId: "admin",
		createdAt: "2025-02-28T02:44:00.347Z",
		updatedAt: "2025-02-28T02:44:00.347Z",
		superRole: {
			id: "admin",
			name: "Admin",
			superRoleId: null,
			createdAt: "2025-02-28T02:44:00.347Z",
			updatedAt: "2025-03-25T13:11:20.437Z",
		},
	},
	{
		id: "technical-support-lead",
		name: "Technical Support Lead",
		superRoleId: "admin",
		createdAt: "2025-03-24T11:39:46.262Z",
		updatedAt: "2025-03-24T11:42:32.746Z",
		superRole: {
			id: "admin",
			name: "Admin",
			superRoleId: null,
			createdAt: "2025-02-28T02:44:00.347Z",
			updatedAt: "2025-03-25T13:11:20.437Z",
		},
	},
	{
		id: "technical-support",
		name: "Technical Support",
		superRoleId: "technical-support-lead",
		createdAt: "2025-03-24T11:40:30.112Z",
		updatedAt: "2025-03-24T11:42:39.678Z",
		superRole: {
			id: "technical-support-lead",
			name: "Technical Support Lead",
			superRoleId: "admin",
			createdAt: "2025-03-24T11:39:46.262Z",
			updatedAt: "2025-03-24T11:42:32.746Z",
		},
	},
	{
		id: "lab",
		name: "Lab",
		superRoleId: "technical-support-lead",
		createdAt: "2025-03-24T11:40:30.112Z",
		updatedAt: "2025-03-24T11:42:39.678Z",
		superRole: {
			id: "technical-support-lead",
			name: "Technical Support Lead",
			superRoleId: "admin",
			createdAt: "2025-03-24T11:39:46.262Z",
			updatedAt: "2025-03-24T11:42:32.746Z",
		},
	},
	{
		id: "admin",
		name: "Admin",
		superRoleId: null,
		createdAt: "2025-02-28T02:44:00.347Z",
		updatedAt: "2025-03-25T13:11:20.437Z",
		superRole: null,
	},
];

type RoleNode = {
	id: string;
	position: { x: number; y: number };
	data: {
		label: string;
	};
	style: { width: number; height: number };
};

/**
 * set id, position and data,
 * position generated from left to right hierarchically,
 * root roles are placed on the leftmost column,
 * roles with the same superRole should be placed in the same column
 */
const nodeSize = { width: 200, height: 60 };
const gap = { x: 400, y: 200 };
const roleNodes: RoleNode[] = [];

/* helper function to recursively calculate positions */
const calculateNodePosition = (
	role: (typeof roles)[0],
	x: number,
	y: number,
	columnMap: Map<string, number>
): number => {
	/* check if the node is already placed */
	if (roleNodes.find((n) => n.id === role.id)) return x;

	/* find child roles */
	const childRoles = roles.filter((r) => r.superRoleId === role.id);

	/* calculate the total width of the subtree */
	const subtreeWidth =
		childRoles.length > 0 ? (childRoles.length - 1) * gap.x : 0;

	/* calculate the starting x position for child nodes */
	let childX = x - subtreeWidth / 2;

	/* add the current node */
	roleNodes.push({
		id: role.id,
		position: { x, y },
		data: {
			label: role.name,
		},
		style: {
			width: nodeSize.width,
			height: nodeSize.height,
		},
	});

	/* place child roles in the next row */
	let maxX = x;
	for (const child of childRoles) {
		const newX = calculateNodePosition(child, childX, y + gap.y, columnMap);
		childX += gap.x;
		maxX = Math.max(maxX, newX);
	}

	return maxX;
};

/* start with root roles (superroleid: null) */
const rootRoles = roles.filter((r) => r.superRoleId === null);
let rootX = 0;
let rootY = 0;
for (const rootRole of rootRoles) {
	const subtreeWidth = calculateNodePosition(
		rootRole,
		rootX,
		rootY,
		new Map()
	);
	rootX += subtreeWidth + gap.x; /* add horizontal space between root nodes */
}
/* generate initial edges */
const initialEdges = roles
	.filter((r) => r.superRoleId)
	.map((r) => ({
		id: `${r.id}-${r.superRoleId}`,
		source: r.superRoleId as string,
		target: r.id,
		label: r.name,
	}));

const TreeData = () => {
	return (
		<div
			id="treeWrapper"
			className="w-[60vw] h-[40vh] m-4
			border border-dashed border-gray-300"
		>
			<ReactFlow
				nodes={roleNodes}
				edges={initialEdges}
				colorMode={"dark"}
			>
				<Controls />
			</ReactFlow>
		</div>
	);
};

export default TreeData;
