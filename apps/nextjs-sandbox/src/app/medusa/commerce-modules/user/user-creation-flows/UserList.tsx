"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserList, UserQK } from "../api";
import { Table, Tbody, Thead } from "@/app/styles/basic/table/table/Table";
import { DeleteUser } from "./DeleteTester";

export const UserList = () => {
	const getUserListQuery = useQuery({
		queryKey: [UserQK.GET_USER_LIST],
		queryFn: async () => {
			const res = await getUserList();
			return res;
		},
	});

	if (getUserListQuery.isLoading) {
		return <div>Loading...</div>;
	}

	if (getUserListQuery.isError) {
		return <div>Error loading users.</div>;
	}

	return (
		<div>
			<h1>User List</h1>
			<div className="bg-neutral-500">
				<Table>
					<Thead>
						<tr>
							<th>ID</th>
							<th>First Name</th>
							<th>Last Name</th>
							<th>Email</th>
							<th></th>
						</tr>
					</Thead>
					<Tbody>
						{getUserListQuery.data?.map((user: any) => (
							<tr key={user.id}>
								<td>{user.id}</td>
								<td>{user.first_name}</td>
								<td>{user.last_name}</td>
								<td>{user.email}</td>
								<td>
									<DeleteUser userId={user.id} />
								</td>
							</tr>
						))}
					</Tbody>
				</Table>
			</div>
		</div>
	);
};
