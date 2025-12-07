import {
	Dispatch,
	ForwardedRef,
	forwardRef,
	MutableRefObject,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";

const DialogContent = forwardRef(function DialogContent(
	props: { setShowDialog: Dispatch<SetStateAction<boolean>> },
	ref: ForwardedRef<HTMLDialogElement | null>
) {
	const { setShowDialog } = props;
	const dialogRef = ref as MutableRefObject<HTMLDialogElement | null>;

	const [count, setCount] = useState(0);

	return (
		<div
			className="flex flex-col w-[calc(100vw-80px)] max-w-[800px] p-3 gap-2
				text-white"
		>
			<p>Hit Esc or click Close to close me. </p>
			<p>
				In this example, we hope that states should be reset when dialog
				is closed, if we simply use `showDialog && &lt;Dialog /&gt;`, it
				works fine on Windows Chrome and Android Chrome, but the dialog
				will disappear on iOS.
			</p>
			<p>
				To avoid this, we use `dialogRef.current` to close and open the
				dialog, but never unmout it. Instead, we unmout the
				dialog&apos;s child, which is DialogContent. This way, the
				states will be reset when the dialog is closed while the dialog
				shows correctly on iOS.
			</p>
			<div className="flex items-center gap-10">
				<button
					className="bg-black px-2 py-1
					rounded-md select-none"
					onClick={() => {
						setCount(count + 1);
					}}
				>
					Count +
				</button>{" "}
				<div className="text-white">{count}</div>
			</div>
			<button
				className="text-white/80 px-2 py-1
				bg-sky-500 hover:bg-white/20
				rounded-md"
				onClick={() => {
					if (dialogRef.current) {
						dialogRef.current.close();
						setShowDialog(false);
					}
				}}
			>
				Close
			</button>
		</div>
	);
});

const Dialog = forwardRef(function Dialog(
	props: {
		showDialog: boolean;
		setShowDialog: Dispatch<SetStateAction<boolean>>;
	},
	ref: ForwardedRef<HTMLDialogElement | null>
) {
	const { showDialog, setShowDialog } = props;
	const dialogRef = ref as MutableRefObject<HTMLDialogElement | null>;
	const contentRef = useRef<HTMLDivElement | null>(null);

	const handleClickOutside = (e: MouseEvent) => {
		if (contentRef.current) {
			if (
				!contentRef.current.contains(e.target as Node) &&
				contentRef.current !== e.target
			) {
				dialogRef.current?.close();
				setShowDialog(false);
			}
		}
	};

	useEffect(() => {
		if (dialogRef.current) {
			dialogRef.current.addEventListener("click", handleClickOutside);
		}
		return () => {
			if (dialogRef.current) {
				dialogRef.current.removeEventListener(
					"click",
					handleClickOutside
				);
			}
		};
	}, []);

	return (
		<dialog
			ref={dialogRef}
			className="mx-auto
			bg-white/10
			shadow-lg rounded-md backdrop-blur-sm
			backdrop:bg-black/50 backdrop:[backdrop-filter:blur(1px)]"
		>
			{showDialog && (
				<div ref={contentRef}>
					<DialogContent
						ref={dialogRef}
						setShowDialog={setShowDialog}
					/>
				</div>
			)}
		</dialog>
	);
});

export default Dialog;
