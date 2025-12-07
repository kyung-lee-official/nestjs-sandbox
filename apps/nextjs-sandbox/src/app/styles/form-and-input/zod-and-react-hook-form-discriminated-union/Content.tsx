"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Define the Zod schema with a discriminated union
const personSchema = z.object({
	type: z.literal("person"),
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	age: z.number().min(18, "Must be at least 18"),
});

const companySchema = z.object({
	type: z.literal("company"),
	companyName: z.string().min(1, "Company name is required"),
	registrationNumber: z.string().min(1, "Registration number is required"),
});

const formSchema = z.discriminatedUnion("type", [personSchema, companySchema]);

// 2. Infer the TypeScript type for the form
type FormData = z.infer<typeof formSchema>;

export function Content() {
	// 3. Set up react-hook-form with Zod resolver
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema as any),
		defaultValues: {
			type: "person" as const, // Add 'as const' for literal type
		} as FormData,
	});

	// 4. Watch the 'type' field to conditionally render fields
	const type = watch("type");

	// 5. Handle form submission
	const onSubmit = (data: FormData) => {
		console.log("Form submitted:", data);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
			<div>
				<label htmlFor="type">Type</label>
				<select {...register("type")} id="type">
					<option value="person">Person</option>
					<option value="company">Company</option>
				</select>
				{errors.type && (
					<p className="text-red-500">{errors.type.message}</p>
				)}
			</div>

			{type === "person" && (
				<div className="space-y-4">
					<div>
						<label htmlFor="firstName">First Name</label>
						<input
							id="firstName"
							{...register("firstName")}
							className="border p-2 w-full"
						/>
						{"firstName" in errors && errors.firstName && (
							<p className="text-red-500">
								{errors.firstName.message}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="lastName">Last Name</label>
						<input
							id="lastName"
							{...register("lastName")}
							className="border p-2 w-full"
						/>
						{"lastName" in errors && errors.lastName && (
							<p className="text-red-500">
								{errors.lastName.message}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="age">Age</label>
						<input
							id="age"
							type="number"
							{...register("age", { valueAsNumber: true })}
							className="border p-2 w-full"
						/>
						{"age" in errors && errors.age && (
							<p className="text-red-500">{errors.age.message}</p>
						)}
					</div>
				</div>
			)}

			{type === "company" && (
				<div className="space-y-4">
					<div>
						<label htmlFor="companyName">Company Name</label>
						<input
							id="companyName"
							{...register("companyName")}
							className="border p-2 w-full"
						/>
						{"companyName" in errors && errors.companyName && (
							<p className="text-red-500">
								{errors.companyName.message}
							</p>
						)}
					</div>
					<div>
						<label htmlFor="registrationNumber">
							Registration Number
						</label>
						<input
							id="registrationNumber"
							{...register("registrationNumber")}
							className="border p-2 w-full"
						/>
						{"registrationNumber" in errors &&
							errors.registrationNumber && (
								<p className="text-red-500">
									{errors.registrationNumber.message}
								</p>
							)}
					</div>
				</div>
			)}

			<button type="submit" className="bg-blue-500 text-white p-2">
				Submit
			</button>
		</form>
	);
}
