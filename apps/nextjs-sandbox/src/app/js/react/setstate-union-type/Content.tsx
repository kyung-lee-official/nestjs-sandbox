"use client";

import { Dispatch, SetStateAction, useState } from "react";

const Child = ({
	n1,
	setN1,
	n2,
	setN2,
	n3,
	setN3,
}: {
	n1: number;
	setN1: Dispatch<SetStateAction<number>>;
	n2: number | undefined;
	setN2:
		| Dispatch<SetStateAction<number>>
		| Dispatch<SetStateAction<number | undefined>>
		| Dispatch<SetStateAction<undefined>>;
	n3: number | undefined;
	setN3: Dispatch<SetStateAction<number | undefined>>;
}) => {
	return (
		<div className="p-2">
			Checkout the code for details.
			<p>
				If you hope the Child component to accept a union type for
				number or undefined, don&apos;t do this:
			</p>
			<p>
				<del>
					<code>
						{"Dispatch<SetStateAction<number | undefined>>;"}
					</code>
				</del>
			</p>
			<p>This will cause an error when pasing</p>
			<p>
				<code>{"Dispatch<SetStateAction<number>>;"}</code>
			</p>
			<p>or</p>
			<p>
				<code>{"Dispatch<SetStateAction<undefined>>;"}</code>
			</p>
			<p>
				Error:{" "}
				{
					"Type 'SetStateAction<number | undefined>' is not assignable to type 'SetStateAction<number>'."
				}
			</p>
			<p>The correct way is to use the following:</p>
			<p>
				<code>
					{
						"Dispatch<SetStateAction<number>> | Dispatch<SetStateAction<number | undefined>> | Dispatch<SetStateAction<undefined>>;"
					}
				</code>
			</p>
		</div>
	);
};

export const Content = () => {
	const [n, setN] = useState<number>(0);
	const [n3, setN3] = useState<number | undefined>(0);

	return (
		<div>
			<Child
				n1={n}
				setN1={setN}
				n2={n}
				setN2={setN}
				n3={n}
				setN3={setN3}
			/>
		</div>
	);
};
