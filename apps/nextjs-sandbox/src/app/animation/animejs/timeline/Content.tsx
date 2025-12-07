"use client";

import anime, { AnimeTimelineInstance } from "animejs";
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

const StyledDiv = styled.div`
	height: 16px;
	width: 16px;
	background-color: green;
`;

const StyledTitle = styled.h1`
	color: #f0f0f0;
`;

const Content: React.FC<any> = () => {
	const animeRef: MutableRefObject<AnimeTimelineInstance | null> =
		useRef(null);
	const start = () => {
		animeRef.current = anime.timeline({
			autoplay: false,
		});
		animeRef.current.add({
			targets: ".target",
			duration: 5000,
			translateX: 250,
		});
		console.log(animeRef.current);
	};

	return (
		<StyledPage>
			<StyledTitle>Stroke Dashoffset</StyledTitle>

			<StyledContainer>
				<StyledDiv className="target" />
			</StyledContainer>
			<button onClick={start}>Start</button>
		</StyledPage>
	);
};

export default Content;
