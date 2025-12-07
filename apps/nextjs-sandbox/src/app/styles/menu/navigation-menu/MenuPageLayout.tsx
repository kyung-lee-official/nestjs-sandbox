"use client";

import styled from "styled-components";
import { DocsMenu } from "./DocsMenu";

const menuInstance = {
	items: [
		{
			type: "doc",
			label: "MenuPage1",
			path: "/styles/menu/navigation-menu/navigation-menu-1",
		},
		{
			type: "doc",
			label: "MenuPage2",
			path: "/styles/menu/navigation-menu/navigation-menu-2",
		},
		{
			type: "category",
			label: "Category 1",
			items: [
				{
					type: "doc",
					label: "MenuPage3",
					path: "/styles/menu/navigation-menu/cat1/navigation-menu-3",
				},
				{
					type: "doc",
					label: "MenuPage4",
					path: "/styles/menu/navigation-menu/cat1/navigation-menu-4",
				},
			],
		},
		{
			type: "category",
			label: "Category 2",
			items: [
				{
					type: "doc",
					label: "MenuPage5",
					path: "/styles/menu/navigation-menu/cat2/navigation-menu-5",
				},
				{
					type: "doc",
					label: "MenuPage6",
					path: "/styles/menu/navigation-menu/cat2/navigation-menu-6",
				},
			],
		},
	],
};

const StyledMain = styled.main`
	display: flex;
`;

const StyledSidebar = styled.div`
	flex: 1;
`;

const StyledContent = styled.div`
	flex: 4;
	padding: 3rem;
`;

export const MenuPageLayout: React.FC<any> = ({ activeKey, children }) => {
	const defaultOpenKeys = ["/styles/menu/cat1/menu-3"];

	return (
		<StyledMain>
			<StyledSidebar>
				<DocsMenu
					items={menuInstance.items}
					defaultOpenKeys={defaultOpenKeys}
					activeKey={activeKey}
				/>
			</StyledSidebar>
			<StyledContent>{children}</StyledContent>
		</StyledMain>
	);
};
