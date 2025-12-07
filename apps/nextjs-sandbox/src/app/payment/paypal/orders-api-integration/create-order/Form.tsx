"use client";

import { useForm } from "react-hook-form";
import { nanoid } from "nanoid";

export type OrderFormData = {
	intent: "CAPTURE" | "AUTHORIZE";
	reference_id: string;
	currency_code: string;
	amount_value: string;
	address_line_1: string;
	address_line_2: string;
	admin_area_1: string;
	admin_area_2: string;
	postal_code: string;
	country_code: string;
	email_address: string;
	payment_method_preference: "UNRESTRICTED" | "IMMEDIATE_PAYMENT_REQUIRED";
	return_url: string;
	cancel_url: string;
};

type FormProps = {
	onSubmit: (data: OrderFormData) => void;
	isLoading?: boolean;
};

export const Form = ({ onSubmit, isLoading = false }: FormProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch,
	} = useForm<OrderFormData>({
		defaultValues: {
			intent: "AUTHORIZE",
			reference_id: nanoid(),
			currency_code: "USD",
			amount_value: "0.01",
			address_line_1: "2211 N First Street",
			address_line_2: "17.3.160",
			admin_area_1: "CA",
			admin_area_2: "San Jose",
			postal_code: "95131",
			country_code: "US",
			email_address: "sb-pfrec25202733@personal.example.com",
			payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
			return_url: `http://localhost:4000/payment/paypal/orders-api-integration/return`,
			cancel_url: `http://localhost:4000/payment/paypal/orders-api-integration/cancel`,
		},
		mode: "onChange",
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<h3 className="text-lg font-medium">Order Details</h3>

			{/* Intent */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Intent
				</label>
				<select
					{...register("intent", { required: "Intent is required" })}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="CAPTURE">CAPTURE</option>
					<option value="AUTHORIZE">AUTHORIZE</option>
				</select>
				{errors.intent && (
					<p className="text-red-500 text-sm mt-1">
						{errors.intent.message}
					</p>
				)}
			</div>

			{/* Reference ID */}
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Reference ID
				</label>
				<input
					type="text"
					{...register("reference_id", {
						required: "Reference ID is required",
					})}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{errors.reference_id && (
					<p className="text-red-500 text-sm mt-1">
						{errors.reference_id.message}
					</p>
				)}
			</div>

			{/* Amount */}
			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Currency Code
					</label>
					<input
						type="text"
						{...register("currency_code", {
							required: "Currency code is required",
							minLength: {
								value: 3,
								message: "Currency code must be 3 characters",
							},
							maxLength: {
								value: 3,
								message: "Currency code must be 3 characters",
							},
						})}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.currency_code && (
						<p className="text-red-500 text-sm mt-1">
							{errors.currency_code.message}
						</p>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Amount
					</label>
					<input
						type="text"
						{...register("amount_value", {
							required: "Amount is required",
							pattern: {
								value: /^\d+(\.\d{1,2})?$/,
								message: "Invalid amount format",
							},
						})}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.amount_value && (
						<p className="text-red-500 text-sm mt-1">
							{errors.amount_value.message}
						</p>
					)}
				</div>
			</div>

			{/* Address */}
			<h4 className="text-md font-medium text-gray-800 mt-6">
				Address Information
			</h4>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Address Line 1
				</label>
				<input
					type="text"
					{...register("address_line_1")}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Address Line 2
				</label>
				<input
					type="text"
					{...register("address_line_2")}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						State/Province
					</label>
					<input
						type="text"
						{...register("admin_area_1")}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						City
					</label>
					<input
						type="text"
						{...register("admin_area_2")}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Postal Code
					</label>
					<input
						type="text"
						{...register("postal_code")}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Country Code
					</label>
					<input
						type="text"
						{...register("country_code", {
							minLength: {
								value: 2,
								message: "Country code must be 2 characters",
							},
							maxLength: {
								value: 2,
								message: "Country code must be 2 characters",
							},
						})}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					{errors.country_code && (
						<p className="text-red-500 text-sm mt-1">
							{errors.country_code.message}
						</p>
					)}
				</div>
			</div>

			{/* Payment Source */}
			<h4 className="text-md font-medium text-gray-800 mt-6">
				Payment Information
			</h4>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Email Address
				</label>
				<input
					type="email"
					{...register("email_address", {
						pattern: {
							value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
							message: "Invalid email address",
						},
					})}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{errors.email_address && (
					<p className="text-red-500 text-sm mt-1">
						{errors.email_address.message}
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Payment Method Preference
				</label>
				<select
					{...register("payment_method_preference")}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<option value="UNRESTRICTED">UNRESTRICTED</option>
					<option value="IMMEDIATE_PAYMENT_REQUIRED">
						IMMEDIATE_PAYMENT_REQUIRED
					</option>
				</select>
			</div>

			{/* Experience Context */}
			<h4 className="text-md font-medium text-gray-800 mt-6">
				Experience Context
			</h4>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Return URL
				</label>
				<input
					type="url"
					{...register("return_url", {
						pattern: {
							value: /^https?:\/\/.+/,
							message: "Invalid URL format",
						},
					})}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{errors.return_url && (
					<p className="text-red-500 text-sm mt-1">
						{errors.return_url.message}
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Cancel URL
				</label>
				<input
					type="url"
					{...register("cancel_url", {
						pattern: {
							value: /^https?:\/\/.+/,
							message: "Invalid URL format",
						},
					})}
					className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				{errors.cancel_url && (
					<p className="text-red-500 text-sm mt-1">
						{errors.cancel_url.message}
					</p>
				)}
			</div>

			{/* Form Status */}
			<div className="pt-4 border-t">
				<div className="flex items-center justify-between">
					<div className="text-sm text-gray-600">
						Form Status:{" "}
						{isValid ? (
							<span className="text-green-600 font-medium">
								Valid
							</span>
						) : (
							<span className="text-red-600 font-medium">
								Invalid
							</span>
						)}
					</div>
					<button
						type="submit"
						disabled={!isValid || isLoading}
						className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
					>
						{isLoading ? "Creating Order..." : "Create Order"}
					</button>
				</div>
			</div>
		</form>
	);
};
