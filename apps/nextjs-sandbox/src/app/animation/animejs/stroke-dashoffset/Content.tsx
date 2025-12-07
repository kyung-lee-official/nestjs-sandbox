"use client";

import anime from "animejs";
import { AnimeInstance } from "animejs";
import React, { MutableRefObject, useRef } from "react";
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

const StyledPath = styled.path`
	stroke-width: 3px;
	stroke: #000000;
	fill: none;
`;

const Content: React.FC<any> = () => {
	const animeRef: MutableRefObject<AnimeInstance | null> = useRef(null);
	const start = () => {
		animeRef.current = anime({
			targets: ".stroke-dashoffset",
			strokeDashoffset: [anime.setDashoffset, 0],
			stroke: "#000000",
			easing: "easeInOutSine",
			duration: 1500,
			autoplay: false,
		});
		animeRef.current.play();
	};

	return (
		<StyledPage>
			<StyledTitle>Stroke Dashoffset</StyledTitle>
			<StyledContainer>
				<StyledSvgContainer>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="300"
						height="300"
						viewBox="0 0 300 300"
					>
						<StyledPath
							className="stroke-dashoffset"
							d="M225 150C225 191.421 191.421 225 150 225C108.579 225 75 191.421 75 150C75 108.579 108.579 75 150 75C191.421 75 225 108.579 225 150Z"
						/>
					</svg>
				</StyledSvgContainer>
			</StyledContainer>
			<button onClick={start} className="text-white">
				Start
			</button>
		</StyledPage>
	);
};

export default Content;
