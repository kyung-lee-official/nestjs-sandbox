const data = {
	id: 1,
	name: "John",
	age: 25,
};

export async function GET(request: Request) {
	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}

export async function PATCH(request: Request) {
	const body = await request.json();
	data.name = body.name;
	data.age = body.age;
	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
