"use client";

import Link from "next/link";

export const Content = () => {
	const zero = 0;
	const emptyArray: any[] = [];
	const falseValue = false;
	const nullValue = null;
	const undefinedValue = undefined;
	const emptyString = "";
	const NaNValue = NaN;

	return (
		<div className="p-4">
			<Link
				href={"https://developer.mozilla.org/en-US/docs/Glossary/Falsy"}
				className="underline"
			>
				Falsy
			</Link>
			<div>zero: {zero}</div>
			<div>emptyArray: {emptyArray}</div>
			<div>falseValue: {falseValue}</div>
			<div>nullValue: {nullValue}</div>
			<div>undefinedValue: {undefinedValue}</div>
			<div>emptyString: {emptyString}</div>
			<div>NaNValue: {NaNValue}</div>

			<div className="my-2 font-bold">
				Wrapped with Template literals (Template strings)
			</div>
			<div>{`zero: ${zero}`}</div>
			<div>{`emptyArray: ${emptyArray}`}</div>
			<div>{`falseValue: ${falseValue}`}</div>
			<div>{`nullValue: ${nullValue}`}</div>
			<div>{`undefinedValue: ${undefinedValue}`}</div>
			<div>{`emptyString: ${emptyString}`}</div>
			<div>{`NaNValue: ${NaNValue}`}</div>

			<div className="my-2 font-bold">
				Connected with `&apos;`+`&apos;` (the result is same as above)
			</div>
			<div>zero: {zero + ""}</div>
			<div>emptyArray: {emptyArray + ""}</div>
			<div>falseValue: {falseValue + ""}</div>
			<div>nullValue: {nullValue + ""}</div>
			<div>undefinedValue: {undefinedValue + ""}</div>
			<div>emptyString: {emptyString + ""}</div>
			<div>NaNValue: {NaNValue + ""}</div>
		</div>
	);
};
