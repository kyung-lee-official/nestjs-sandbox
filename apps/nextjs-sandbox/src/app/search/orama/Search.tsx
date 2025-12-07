import { useEffect, useState, useTransition } from "react";
import { oramaClient } from "./orama-client";
import Link from "next/link";

export function Search() {
	const [isPending, startTransition] = useTransition();
	const [term, setTerm] = useState<string>("");
	const [results, setResults] = useState<any>();

	function searchTerms(term: string) {
		startTransition(() => {
			setTerm(term);
		});
	}

	useEffect(() => {
		oramaClient
			.search({
				term: term,
			})
			.then((response: any) => {
				setResults(response);
			})
			.catch((error) => {
				console.error(error);
			});
	}, [term]);

	return (
		<div className="flex-[0_1_50%] flex flex-col max-w-[50%] h-8 gap-4">
			<input
				type="text"
				className="p-2
				bg-neutral-100
				rounded
				outline-none"
				onChange={(e) => {
					searchTerms(e.target.value);
				}}
			/>
			<div className="flex flex-col gap-4">
				{term &&
					results?.hits.map((hit: any) => {
						console.log(hit);
						return (
							<Link
								key={hit.id}
								href={hit.document.path}
								className="p-4
								border-neutral-300 border-2 rounded"
							>
								<h2
									className="font-bold
									overflow-hidden whitespace-nowrap text-ellipsis"
								>
									{hit.document.title}
								</h2>
								<p className="overflow-hidden whitespace-nowrap text-ellipsis">
									{hit.document.content}
								</p>
							</Link>
						);
					})}
			</div>
		</div>
	);
}
