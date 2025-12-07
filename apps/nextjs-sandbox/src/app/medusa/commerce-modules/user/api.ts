import axios from "axios";

export enum UserQK {
	GET_USER_LIST = "get-user-list",
}

export async function inviteUser(email: string) {
	const res = await axios.post(
		`/commerce-modules/user/invite-user`,
		{
			email,
		},
		{
			baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
			headers: {
				"x-publishable-api-key":
					process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
			},
		}
	);
	return res.data;
}

export async function registerUser(
	token: string,
	firstName: string,
	lastName: string,
	email: string,
	avatar_url?: string
) {
	const res = await axios.post(
		`/commerce-modules/user/create-user`,
		{
			first_name: firstName,
			last_name: lastName,
			email: email,
			avatar_url: avatar_url,
		},
		{
			baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
			headers: {
				Authorization: `Bearer ${token}`,
				"x-publishable-api-key":
					process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
			},
		}
	);
	return res.data;
}

export async function loginUser(email: string, password: string) {
	const res = await axios.post(
		`/auth/user/emailpass`,
		{
			email,
			password,
		},
		{
			baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
			headers: {
				"x-publishable-api-key":
					process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
			},
		}
	);
	return res.data;
}

export const getUserList = async () => {
	const res = await axios.get(`/commerce-modules/user`, {
		baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
		headers: {
			"x-publishable-api-key":
				process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
		},
	});
	return res.data;
};

export const deleteUser = async (userId: string) => {
	const res = await axios.delete(`/commerce-modules/user/${userId}`, {
		baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
		headers: {
			"x-publishable-api-key":
				process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
		},
	});
	return res.data;
};
