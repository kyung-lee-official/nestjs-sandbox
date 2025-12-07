"use client";

import { useState } from "react";
import { Dropdown } from "./dropdown/Dropdown";

type User = {
	id: string;
	name: string;
	email: string;
};

type Fruit =
	| "Apple"
	| "Banana"
	| "Orange"
	| "A very loooooooooooooooooooooooooooooooooooooooooooooooooooooog option";

export const Content = () => {
	const [stringSelected, setStringSelected] = useState<
		string | string[] | null
	>(null);
	const [objectSelected, setObjectSelected] = useState<
		string | string[] | null
	>(null);
	const [hovered, setHovered] = useState<any>(null);

	const stringOptions: Fruit[] = [
		"Apple",
		"Banana",
		"Orange",
		"A very loooooooooooooooooooooooooooooooooooooooooooooooooooooog option",
	];

	const objectOptions: User[] = [
		{ id: "1", name: "John", email: "john@example.com" },
		{ id: "2", name: "Jane", email: "jane@example.com" },
		{ id: "3", name: "Bob", email: "bob@example.com" },
		{
			id: "4",
			name: "Alice",
			email: "alice@this-is-a-very-loooooooooooooooooooooooooooog-email.com",
		},
	];
	const objectOptionIds = objectOptions
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((option) => option.id) as string[];

	return (
		<div
			className="flex gap-10 h-svh
			bg-black/90"
		>
			<div className="w-[500px] p-4 space-y-4">
				{/* String Dropdown - Single Select */}
				<Dropdown
					mode="regular"
					options={stringOptions}
					selected={stringSelected}
					setSelected={setStringSelected}
					setHover={setHovered}
					placeholder="Select a fruit"
					getLabel={(selected) => {
						const found = stringOptions.find(
							(obj) => obj === selected
						);
						switch (found) {
							case "Apple":
								return <div>🍏 {found}</div>;
							case "Banana":
								return <div>🍌 {found}</div>;
							case "Orange":
								return <div>🍊 {found}</div>;
							default:
								return found;
						}
					}}
					optionWrapperClassName={(option, { selected, hovered }) => {
						return `px-2 py-1 
						${hovered ? "bg-neutral-700" : ""}}
						cursor-pointer truncate`;
					}}
					renderOption={(option, { selected, hovered }) => {
						const found = stringOptions.find(
							(obj) => obj === option
						);
						return (
							<div
								className={`flex items-center px-2 gap-2 ${
									selected ? "text-blue-500" : ""
								} ${hovered ? "bg-neutral-700" : ""}
								rounded truncate`}
							>
								<span>{found}</span>
							</div>
						);
					}}
					selectedItemClassName={(option) => {
						switch (option) {
							case "Apple":
								return "text-green-500 truncate";
							case "Banana":
								return "text-yellow-500 truncate";
							case "Orange":
								return "text-orange-500 truncate";
							default:
								return "text-white truncate";
						}
					}}
					controlClassName="flex items-center flex-wrap min-h-8 px-2 py-1 gap-2
					bg-neutral-800
					border-1 border-neutral-700 rounded-md cursor-pointer"
					placeholderClassName="text-neutral-400 truncate"
					menuClassName="absolute z-10 w-full mt-1
					text-white/60
					bg-neutral-800
					border border-neutral-700 rounded-md overflow-auto"
				/>

				{/* Object Dropdown - Multiple Select with Search */}
				<Dropdown
					mode="search"
					placeholder="Select users"
					options={objectOptionIds}
					selected={objectSelected}
					setSelected={setObjectSelected}
					setHover={setHovered}
					multiple
					getLabel={(selected) => {
						return objectOptions.find((obj) => obj.id === selected)
							?.name as string;
					}}
					getSearchString={(option) => {
						const found = objectOptions.find(
							(obj) => obj.id === option
						);
						return found ? found.name + " " + found.email : "";
					}}
					renderOption={(option, { selected, hovered }) => {
						const found = objectOptions.find(
							(obj) => obj.id === option
						);
						return (
							<div
								className={`flex items-center px-2 gap-2 ${
									selected ? "text-blue-500" : ""
								} ${hovered ? "bg-neutral-700" : ""}
								rounded truncate`}
							>
								<span>{found?.name}</span>
								<span className="text-neutral-400">
									{found?.email}
								</span>
							</div>
						);
					}}
					selectedItemClassName={(option) => {
						return `flex px-1.5 gap-2
						text-white truncate
						border-1 border-neutral-500 rounded-md`;
					}}
					removeButtonClassName={(option) => {
						return `text-red-500 cursor-pointer`;
					}}
					controlClassName="flex items-center flex-wrap min-h-8 px-2 py-1 gap-2
					bg-neutral-800
					border-1 border-neutral-700 rounded-md cursor-pointer"
					placeholderClassName="text-neutral-400 truncate"
					menuClassName="absolute z-10 w-full mt-1
					text-white/60
					bg-neutral-800
					border border-neutral-700 rounded-md overflow-auto"
					searchInputClassName="w-full p-2 border-b border-neutral-700 outline-none"
					optionWrapperClassName={(option, { selected, hovered }) => {
						return `px-2 py-1 cursor-pointer
						${hovered ? "bg-neutral-700" : ""}}`;
					}}
				/>
			</div>
			{/* Preview hovered item */}
			{hovered && (
				<div className="mt-2 p-2 bg-neutral-400 rounded">
					Hovered: {JSON.stringify(hovered)}
				</div>
			)}
		</div>
	);
};
