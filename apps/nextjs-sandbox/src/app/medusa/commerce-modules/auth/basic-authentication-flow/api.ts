import axios from "axios";

export enum TesterQK {
	GET_TESTER_LIST = "get-tester-list",
}

export async function getRegistrationAuthenticationToken(
	email: string,
	password: string,
	actor_type: string
) {
	const res = await axios.post(
		`/auth/${actor_type}/emailpass/register`,
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

export async function loginTester(email: string, password: string) {
	const res = await axios.post(
		`/auth/tester/emailpass`,
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

export async function registerTester(
	token: string,
	firstName: string,
	lastName: string,
	email: string,
	avatar_url?: string
) {
	const res = await axios.post(
		`/tester`,
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

export const getTesterList = async () => {
	const res = await axios.get(`/tester`, {
		baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
		headers: {
			"x-publishable-api-key":
				process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
		},
	});
	return res.data;
};

export const deleteTester = async (testerId: string) => {
	const res = await axios.delete(`/tester/${testerId}`, {
		baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
		headers: {
			"x-publishable-api-key":
				process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
		},
	});
	return res.data;
};
