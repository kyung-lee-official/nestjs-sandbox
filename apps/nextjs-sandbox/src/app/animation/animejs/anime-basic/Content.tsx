"use client";

import anime from "animejs";
import { AnimeInstance } from "animejs";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const StyledPage = styled.div`
	padding: 2rem;
	background-color: #434343;
	min-height: 100vh;
`;

const StyledContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #d9d9d9;
	border-radius: 5px;
	min-height: 5rem;
`;

const StyledSvgContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #d9d9d9;
	border-radius: 5px;
	width: 300px;
	height: 300px;
`;

const StyledTitle = styled.h1`
	color: #f0f0f0;
`;

const StyledDiv = styled.div`
	height: 16px;
	width: 16px;
	background-color: green;
`;

const StyledPath = styled.path`
	fill: #b37feb;
`;

let shapes = [
	{
		d: "M300 150C300 232.843 232.843 300 150 300C67.1573 300 0 232.843 0 150C0 67.1573 67.1573 0 150 0C232.843 0 300 67.1573 300 150Z",
	},
	{
		d: "M115.182 158.839C157.849 229.849 298.592 223.63 227.582 266.298C156.572 308.965 64.4181 285.988 21.7509 214.978C-20.9162 143.968 2.06022 51.8146 73.0703 9.14746C144.08 -33.5197 72.515 87.829 115.182 158.839Z",
	},
	{
		d: "M187 115C229.667 186.01 291.592 227.631 220.582 270.298C124 328.33 172.405 359 66.0703 176C-25 19.2692 -18 63.6622 66.0705 13.1475C137.081 -29.5196 144.333 43.9899 187 115Z",
	},
];

const Content = () => {
	const animeRefTarget: MutableRefObject<AnimeInstance | null> = useRef(null);
	const animeRefMorph: MutableRefObject<AnimeInstance | null> = useRef(null);
	const [dark, setDark] = useState<boolean>(false);

	function themeSwitch() {
		setDark(!dark);
		animeRefMorph.current = anime({
			targets: ".morph",
			// d: [{ value: dark ? shapes[0].d : shapes[1].d }],
			d: [
				{ value: shapes[0]!.d },
				{ value: shapes[1]!.d },
				{ value: shapes[2]!.d },
			],
			duration: 4000,
			autoplay: true,
			easing: "easeOutQuad",
		});
	}

	useEffect(() => {
		animeRefTarget.current = anime({
			targets: ".target",
			translateX: 250,
			loop: true,
		});
	}, []);
	return (
		<StyledPage>
			<StyledTitle>Target</StyledTitle>
			<StyledContainer>
				<StyledDiv className="target" />
			</StyledContainer>
			<StyledTitle>Morph</StyledTitle>
			<StyledContainer>
				<StyledSvgContainer onClick={themeSwitch}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="100"
						height="100"
						viewBox="0 0 300 300"
					>
						<g>
							<StyledPath
								className="morph"
								d="M300 150C300 232.843 232.843 300 150 300C67.1573 300 0 232.843 0 150C0 67.1573 67.1573 0 150 0C232.843 0 300 67.1573 300 150Z"
							/>
						</g>
					</svg>
				</StyledSvgContainer>
			</StyledContainer>
		</StyledPage>
	);
};

export default Content;
