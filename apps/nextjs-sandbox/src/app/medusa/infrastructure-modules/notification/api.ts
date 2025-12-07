import axios from "axios";

export async function resendTestNotification() {
	const res = await axios.get(
		"infrastructure-modules/test-send-email-notification",
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
