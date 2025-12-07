"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchHelloWorld = async () => {
	const res = await axios.get("/hello-world", {
		baseURL: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
		headers: {
			"x-publishable-api-key":
				process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
		},
	});
	return res.data;
};

export const Content = () => {
	const hwQuery = useQuery({
		queryKey: ["hello-world"],
		queryFn: fetchHelloWorld,
	});

	if (hwQuery.isLoading) {
		return <div>Loading...</div>;
	}

	if (hwQuery.error) {
		return <div>Error: {hwQuery.error.message}</div>;
	}

	console.log(hwQuery.data);

	return <div className="m-4">{hwQuery.data.message}</div>;
};
