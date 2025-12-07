"use client";

import anime from "animejs";
import React, { useEffect } from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: row;
`;

const StyledServiceWrapper = styled.div`
	background: #f4f6f6;
	flex: 1;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	padding: 50px;
	overflow: hidden;
	cursor: pointer;
	transition: all 0.2s linear;
	&:hover {
		color: #fff;
	}
	div {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
	}
	div h3 {
		z-index: 1;
	}
	p {
		line-height: 23px;
		z-index: 1;
	}
`;

const StyledArrowOne = styled.div`
	height: 40px;
	width: 40px;
	border-radius: 100px;
	background-color: #0311c6;
	position: absolute;
	right: 0;
`;

const StyledArrowOneSmall = styled.div`
	height: 40px;
	width: 40px;
	border-radius: 100px;
	z-index: 10;
	background-color: #17a2cc;
`;

const StyledSvg = styled.svg`
	position: absolute;
	z-index: 1000;
	right: 12px;
`;

const Content: React.FC<any> = () => {
	useEffect(() => {
		let services = document.querySelectorAll(".service-wrapper");

		services.forEach((service) => {
			service.addEventListener("mouseenter", (event) => {
				anime.remove(service.querySelector(".arrow"));
				anime.remove(service.querySelector(".arrow-small"));
				anime({
					targets: service.querySelector(".arrow"),
					easing: "easeOutExpo",
					scale: 35,
					duration: 1000,
				});

				anime({
					targets: service.querySelector(".arrow-small"),
					easing: "easeOutExpo",
					scale: 5,
					duration: 1300,
				});

				anime
					.timeline()
					.add({
						targets: service.querySelector("svg"),
						translateX: -25,
						translateY: 25,
						easing: "easeOutExpo",
						duration: 400,
					})
					.add({
						targets: service.querySelector("svg"),
						translateX: 0,
						translateY: 0,
						easing: "easeOutExpo",
						duration: 1700,
						offset: 100,
					});
			});

			service.addEventListener("mouseleave", (event) => {
				anime.remove(service.querySelector(".arrow"));
				anime.remove(service.querySelector(".arrow-small"));
				anime({
					targets: service.querySelector(".arrow"),
					easing: "easeOutExpo",
					scale: 1,
					duration: 600,
				});

				anime({
					targets: service.querySelector(".arrow-small"),
					easing: "easeOutExpo",
					scale: 1,
					duration: 900,
				});

				anime
					.timeline()
					.add({
						targets: service.querySelector("svg"),
						translateX: -25,
						translateY: 25,
						easing: "easeOutExpo",
						duration: 400,
					})
					.add({
						targets: service.querySelector("svg"),
						translateX: 0,
						translateY: 0,
						easing: "easeOutExpo",
						duration: 1700,
						offset: 100,
					});
			});
		});
	}, []);

	return (
		<StyledWrapper className="wrapper">
			<StyledServiceWrapper className="service-wrapper">
				<div>
					<h3>Sell your device</h3>
					<StyledSvg
						width="14"
						height="14"
						xmlns="http://www.w3.org/2000/svg"
					>
						<text
							transform="rotate(135 6.68 7.16)"
							fill="#fff"
							fillRule="evenodd"
							fontFamily="Ionicons"
							fontSize="25"
							fontWeight="400"
							letterSpacing=".744"
						>
							<tspan x="-2.319" y="16.66">
								
							</tspan>
						</text>
					</StyledSvg>
					<StyledArrowOne
						className="arrow"
						id="arrow-one"
					></StyledArrowOne>
					<StyledArrowOneSmall
						className="arrow-small"
						id="arrow-one-small"
					></StyledArrowOneSmall>
				</div>
				<p>
					Get instant quote <br /> and ship device for free.
				</p>
			</StyledServiceWrapper>
		</StyledWrapper>
	);
};

export default Content;
