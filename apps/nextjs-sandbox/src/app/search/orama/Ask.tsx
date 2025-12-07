import { useEffect, useMemo, useRef, useState } from "react";
import { oramaClient } from "./orama-client";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { Bubble } from "./bubble/Bubble";

export const Ask = () => {
	const [conversation, setConversation] = useState<any[]>([]);
	const [question, setQuestion] = useState("");
	const conversationRef = useRef<HTMLDivElement>(null);

	const cachedAnswerSession = useMemo(() => {
		return oramaClient.createAnswerSession({
			inferenceType: "documentation",
			initialMessages: [],
			events: {
				// onMessageChange: (messages) => console.log({ messages }),
				// onMessageLoading: (loading) => console.log({ loading }),
				// onAnswerAborted: (aborted) => console.log({ aborted }),
				// onSourceChange: (sources) => console.log({ sources }),
			},
		});
	}, []);

	useEffect(() => {
		const lastBubble = conversation[conversation.length - 1];
		if (lastBubble?.type === "a") {
			conversationRef.current?.scrollTo({
				top: conversationRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [conversation]);

	const askQuestion = async (e: any) => {
		e.preventDefault();
		const cachedQuestion = question;
		setQuestion("");
		setConversation((conversation) => [
			...conversation,
			{
				type: "q",
				bubbleId: nanoid(),
				state: "fulfilled",
				content: cachedQuestion,
				timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
			},
		]);
		const bubbleId = nanoid();
		setConversation((conversation) => [
			...conversation,
			{
				type: "a",
				bubbleId,
				state: "pending",
				content: undefined,
				timestamp: undefined,
			},
		]);
		try {
			const answer = await cachedAnswerSession.ask({
				term: cachedQuestion,
			});
			setConversation((conversation) => {
				return conversation.map((bubble) => {
					if (bubble.bubbleId === bubbleId) {
						return {
							...bubble,
							state: "fulfilled",
							content: answer,
							timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
						};
					}
					return bubble;
				});
			});
		} catch (error) {
			setConversation((conversation) => {
				return conversation.map((bubble) => {
					if (bubble.bubbleId === bubbleId) {
						return {
							...bubble,
							state: "error",
							content: "An error occurred",
							timestamp: dayjs().format("YYYY-MM-DD HH:mm:ss"),
						};
					}
					return bubble;
				});
			});
		}
	};

	return (
		<div className="flex-[0_1_50%] flex flex-col gap-4">
			<div
				ref={conversationRef}
				className="flex flex-col h-[80dvh] p-4 gap-6
				bg-neutral-200/60
				overflow-y-auto"
			>
				{conversation.map((bubble, i) => {
					return (
						<Bubble
							key={i}
							type={bubble.type}
							state={bubble.state}
							timestamp={bubble.timestamp}
							content={bubble.content}
						/>
					);
				})}
			</div>
			<form
				className="flex flex-col items-end gap-4"
				onSubmit={askQuestion}
			>
				<textarea
					className="w-full h-24 p-2
					bg-neutral-100
					outline-none resize-none"
					onChange={(e) => {
						setQuestion(e.target.value);
					}}
					value={question}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							askQuestion(e);
						}
					}}
				/>
				<button
					type="submit"
					className="w-20 p-2
					bg-neutral-200"
				>
					Ask
				</button>
			</form>
		</div>
	);
};
