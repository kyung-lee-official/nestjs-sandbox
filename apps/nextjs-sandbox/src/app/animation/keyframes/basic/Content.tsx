"use client";

import styled, { keyframes } from "styled-components";

const gradient = keyframes`
	0% {
		background-position: 0% 0%;
	}
	25% {
		background-position: 100% 0%;
	}
	50% {
		background-position: 100% 100%;
	}
	75% {
		background-position: 0% 100%;
	}
	100% {
		background-position: 0% 0%;
	}
`;

const StyledContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
	width: 100%;
	height: 600px;
	background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
	background-size: 500% 500%;
	animation: ${gradient} 15s ease infinite;
`;

const Content = () => {
  return (
    <StyledContainer>
      <div className="">
        <h1 className="">Pure CSS Gradient Background Animation</h1>
      </div>
    </StyledContainer>
  );
};

export default Content;
