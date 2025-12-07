const MaskImageFromLocal = () => {
	return (
		<div className="flex gap-8">
			<div className="flex flex-col items-center">
				<img src="https://picsum.photos/200" width={100} alt="" />
				png
			</div>
			<div className="flex flex-col items-center">
				<svg
					width="100"
					height="100"
					viewBox="0 0 100 100"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fill="url(#linear_gradient)"
						d="M100 0H0V100H100V0Z"
					/>
					<defs>
						<linearGradient
							id="linear_gradient"
							x1="50%"
							y1="0%"
							x2="50%"
							y2="100%"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="white" offset={0} />
							<stop stopColor="black" offset={1} />
						</linearGradient>
					</defs>
					<mask
						id="svg_mask"
						maskUnits="userSpaceOnUse"
						x="0"
						y="0"
						width="100"
						height="100"
					>
						<path
							d="M100 0H0V100H100V0Z"
							fill="url(#linear_gradient)"
						/>
					</mask>
				</svg>
				mask
			</div>
			<div className="flex flex-col items-center">
				<div
					className="w-[100px] h-[100px]
					[mask-image:url(#svg_mask)]"
				>
					<img src="https://picsum.photos/200" width={100} alt="" />
				</div>
				result
			</div>
		</div>
	);
};

export default MaskImageFromLocal;
