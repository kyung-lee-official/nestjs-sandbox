import axios from "axios";

export async function emitTestEvent() {
	const res = await axios.get(
		"framework/events-and-subscribers/emit-test-event",
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
