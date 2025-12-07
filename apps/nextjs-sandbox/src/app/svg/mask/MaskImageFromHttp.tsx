const MaskImageFromHttp = () => {
	return (
		<div className="flex gap-8">
			<div className="flex flex-col items-center">
				<img src="https://picsum.photos/200" width={100} alt="" />
				png
			</div>
			<div className="flex flex-col items-center">
				<img
					src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/sun.svg"
					width={100}
					alt=""
				/>
				mask
			</div>
			<div className="flex flex-col items-center">
				<div
					className="relative w-[100px] h-[100px]
					bg-[url(https://picsum.photos/200)] bg-contain
					[mask-image:url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/sun.svg)] [mask-size:100px]"
				></div>
				result
			</div>
		</div>
	);
};

export default MaskImageFromHttp;
