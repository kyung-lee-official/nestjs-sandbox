import { useEffect, useState } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

type BubbleType = {
	type: "q" | "a";
	state: "fulfilled" | "pending" | "error";
	content?: string;
	timestamp?: string;
};

const Row = (props: {
	type: "q" | "a";
	timestamp: string | undefined;
	children: React.ReactNode;
}) => {
	return (
		<div className={`flex flex-col gap-2`}>
			<p
				className="flex justify-center
				text-sm text-neutral-400"
			>
				{props.timestamp}
			</p>
			<div
				className={`flex ${
					props.type === "q" ? "justify-end" : "justify-start"
				}`}
			>
				<div
					className={`max-w-96 p-2
					${props.type === "q" ? "bg-blue-200" : "bg-green-200"}
					`}
				>
					{props.children}
				</div>
			</div>
		</div>
	);
};

export const Bubble = (props: BubbleType) => {
	const { type, state, content, timestamp } = props;
	const [mdxContent, setMdxContent] = useState({ __html: "" });

	async function compile() {
		if (content) {
			const processor = unified();
			processor.use(remarkParse).use(remarkRehype).use(rehypeStringify);
			const trimmed = content.replace("[object Object]", "");
			const result = await processor.process(trimmed);
			const resultWithLinks = result
				.toString()
				.replace("<a", "<a class='text-blue-500'")
				.replace(
					"<code",
					`<code class='w-80 p-1
					overflow-x-auto'`
				);
			setMdxContent({ __html: resultWithLinks });
		}
	}

	useEffect(() => {
		if (type === "a") {
			compile();
		}
	}, [content]);

	switch (type) {
		case "q":
			return (
				<Row type="q" timestamp={timestamp}>
					{content}
				</Row>
			);
			break;
		case "a":
			if (state === "pending") {
				return (
					<Row type="a" timestamp={timestamp}>
						...
					</Row>
				);
			}
			if (state === "error") {
				return (
					<Row type="a" timestamp={timestamp}>
						❗{content}❗
					</Row>
				);
			}
			if (state === "fulfilled") {
				return (
					<Row type="a" timestamp={timestamp}>
						<div
							dangerouslySetInnerHTML={mdxContent}
							className="flex flex-col gap-2"
						/>
					</Row>
				);
			}
			break;
		default:
			break;
	}
};
