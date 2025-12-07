"use client";

import { usePathname } from "next/navigation";

function Pathname() {
	const pathname = usePathname();
	return <div>pathname: {pathname}</div>;
}

export default Pathname;
