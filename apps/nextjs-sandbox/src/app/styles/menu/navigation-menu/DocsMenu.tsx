"use client";

import { motion } from "motion/react";
import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";

const StyledLink = styled(Link)`
	text-decoration: none;
	color: black;
`;

const StyledUl = styled.ul`
	list-style-type: none;
	padding: 0;
`;

const StyledSubUl = styled(motion.ul)`
	list-style-type: none;
	padding-left: 1rem;
`;

interface StyledUlHeadProps {
	$hasActiveKey: boolean;
}
const StyledUlHead = styled.div<StyledUlHeadProps>`
	display: flex;
	justify-content: space-between;
	padding: 0.5rem 1rem;
	color: ${(props) => (props.$hasActiveKey ? "#00aeff" : "#000000")};
	border: 1px solid black;
	cursor: pointer;
`;

interface StyledItemProps {
	$isActiveItem: boolean;
}
const StyledItem = styled(motion.li)<StyledItemProps>`
	padding: 0.5rem 1rem;
	color: ${(props) => (props.$isActiveItem ? "#00aeff" : "#000000")};
	border: 1px solid black;
	cursor: pointer;
`;

const StyledWrapperItem = styled.li`
	padding: 0;
`;

const SubMenu: React.FC<any> = (props) => {
	const { item, isDefaultOpen, activeKey } = props;
	const hasActiveKey: boolean =
		item.items.filter((item: any) => {
			return item.path === activeKey;
		}).length > 0;
	const [show, setShow] = useState<boolean>(isDefaultOpen);

	const subUlVariant = {
		hidden: {
			maxHeight: "0px",
		},
		visible: {
			maxHeight: "5000px",
			transition: {
				staggerChildren: 0.1,
				duration: 1,
			},
		},
	};
	const subItem = {
		hidden: {
			opacity: 0,
			x: -10,
		},
		visible: {
			opacity: 1,
			x: 0,
		},
	};

	function onUlHeadClick(event: any) {
		setShow(!show);
	}

	return (
		<StyledWrapperItem>
			<StyledUlHead onClick={onUlHeadClick} $hasActiveKey={hasActiveKey}>
				<div>{item.label}</div>
				<div>🔽</div>
			</StyledUlHead>
			{show ? (
				<StyledSubUl
					initial="hidden"
					animate="visible"
					variants={hasActiveKey ? {} : subUlVariant}
				>
					{item.items.map((item: any, i: number) => {
						const isActiveItem: boolean = item.path === activeKey;
						return (
							<StyledLink href={item.path} key={item.path}>
								<StyledItem
									variants={hasActiveKey ? {} : subItem}
									$isActiveItem={isActiveItem}
								>
									{item.label}
								</StyledItem>
							</StyledLink>
						);
					})}
				</StyledSubUl>
			) : null}
		</StyledWrapperItem>
	);
};

export const DocsMenu: React.FC<any> = (props) => {
	const { items, defaultOpenKeys, activeKey } = props;

	return (
		<StyledUl>
			{items.map((item: any, i: number) => {
				if (!item.items) {
					const isActiveItem: boolean = item.path === activeKey;
					return (
						<StyledLink href={item.path} key={item.path}>
							<StyledItem $isActiveItem={isActiveItem}>
								{item.label}
							</StyledItem>
						</StyledLink>
					);
				} else {
					const isDefaultOpen: boolean =
						item.items.filter((item: any) => {
							for (const key of [...defaultOpenKeys, activeKey]) {
								if (item.path === key) {
									return true;
								}
							}
							return false;
						}).length > 0;
					return (
						<SubMenu
							key={i}
							item={item}
							isDefaultOpen={isDefaultOpen}
							activeKey={activeKey}
						/>
					);
				}
			})}
		</StyledUl>
	);
};
