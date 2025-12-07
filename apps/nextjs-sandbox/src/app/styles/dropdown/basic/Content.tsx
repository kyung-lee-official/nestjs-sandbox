"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Dropdown = () => {
	const [content, setContent] = useState<"basic" | "pro">("basic");
	const [showDropdown, setShowDropdown] = useState<boolean>(false);

	const switchRef = useRef<HTMLDivElement | null>(null);
	const dropdownActiveAreaRef = useRef<HTMLDivElement | null>(null);
	const menuRef = useRef<HTMLUListElement | null>(null);

	const onMouseMove = (e: any) => {
		if (e.target === switchRef.current) {
			setShowDropdown(true);
		}

		if (
			e.target !== switchRef.current &&
			e.target !== dropdownActiveAreaRef.current &&
			e.target !== menuRef.current
		) {
			if (menuRef.current) {
				if (!menuRef.current.contains(e.target)) {
					setShowDropdown(false);
				}
			}
		}
	};

	useEffect(() => {
		window.addEventListener("mousemove", onMouseMove);
		return () => {
			window.removeEventListener("mousemove", onMouseMove);
		};
	}, [switchRef.current, dropdownActiveAreaRef.current, menuRef.current]);

	return (
		<div
			className={`relative flex items-center w-56 h-[56px] p-1 mx-auto gap-4
			font-bold
			[box-shadow:-2px_-2px_6px_#ffffff,2px_2px_6px_#94a3b830] shadow-[#00305620] rounded-full cursor-pointer`}
			onClick={(e: any) => {
				if (
					e.target === menuRef.current ||
					menuRef.current?.contains(e.target)
				) {
					/* Menu is clicked, don't switch basicPro */
				} else {
					if (content === "basic") {
						setContent("pro");
					} else {
						setContent("basic");
					}
				}
			}}
		>
			{/* If mouse leaves this area, the drop-down menu will hide */}
			<div
				ref={dropdownActiveAreaRef}
				className="absolute top-0 right-0 bottom-[-20px] left-0
				z-0"
			/>
			<div
				ref={switchRef}
				className="flex justify-between items-center w-full h-full px-6
				text-blue-300
				bg-blue-200 rounded-full z-0"
			>
				<div className="pointer-events-none">Basic</div>
				<div className="pointer-events-none">Pro</div>
			</div>
			<motion.div
				layout
				style={{
					justifyContent:
						content === "basic" ? "flex-start" : "flex-end",
				}}
				className="absolute top-[4px] right-[4px] bottom-[4px] left-[4px] flex p-1
				rounded-full shadow-inner shadow-blue-300 pointer-events-none"
			>
				<motion.div
					layout
					animate={{
						backgroundColor:
							content === "basic" ? "#0c88e0" : "#003056",
					}}
					transition={{
						duration: 0.3,
						type: "spring",
						stiffness: 400,
						damping: 30,
					}}
					className={`flex justify-center items-center w-36 h-10 p-2 
					text-sky-50 rounded-full
					shadow-md shadow-[#00305620] select-none`}
				>
					{content === "basic" ? "Basic" : "Pro"}
				</motion.div>
			</motion.div>
			{showDropdown && (
				<motion.ul
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: showDropdown ? 1 : 0,
					}}
					ref={menuRef}
					className="absolute top-16 left-0 w-56 p-1
					text-gray-400
					bg-gray-50
					shadow-md rounded-xl"
				>
					<li
						className="flex justify-start items-center py-1 px-3 gap-6
						hover:text-sky-600
						hover:bg-blue-100 rounded-t-xl duration-200"
					>
						<div>Manual</div>
					</li>
					<li
						className="flex justify-start items-center py-1 px-3 gap-6
						hover:text-sky-600
						hover:bg-blue-100 rounded-b-xl duration-200"
					>
						<div>Video</div>
					</li>
				</motion.ul>
			)}
		</div>
	);
};

const Content = () => {
	return (
		<div className="flex flex-col p-10 gap-6">
			<div
				className="flex flex-col items-center gap-2
				text-xl"
			>
				<h1>Basic Dropdown</h1>
				<Dropdown />
			</div>
		</div>
	);
};

export default Content;
