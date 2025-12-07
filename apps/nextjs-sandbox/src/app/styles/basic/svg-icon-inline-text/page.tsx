const Menu = ({ size, fill }: any) => {
	return (
		<span className="inline-block align-middle">
			<svg
				height={size}
				width={size}
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
			>
				<path
					d="M21,6H3A1,1,0,0,1,3,4H21a1,1,0,0,1,0,2Z"
					transform="translate(-2 -4.01)"
				/>
				<path
					d="M21,13H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z"
					transform="translate(-2 -4.01)"
				/>
				<path
					d="M21,20H3a1,1,0,0,1,0-2H21a1,1,0,0,1,0,2Z"
					transform="translate(-2 -4.01)"
				/>
			</svg>
		</span>
	);
};

const Page = () => {
	return (
		<div>
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste est
			aperiam magnam saepe tempore, soluta nulla asperiores eum quam
			doloribus provident voluptatum repellendus? Natus, similique
			temporibus! Architecto magni delectus facere? Lorem ipsum dolor sit,
			amet consectetur adipisicing elit. Iste est aperiam magnam saepe
			tempore, soluta nulla asperiores eum quam doloribus provident{" "}
			<Menu size={24} /> voluptatum repellendus? Natus, similique
			temporibus! Architecto magni delectus facere? Lorem ipsum dolor sit,
			amet consectetur adipisicing elit. Iste est aperiam magnam saepe
			tempore, soluta nulla asperiores eum quam doloribus provident
			voluptatum repellendus? Natus, similique temporibus! Architecto
			magni delectus facere? Lorem ipsum dolor sit, amet consectetur
			adipisicing elit. Iste est aperiam magnam saepe tempore, soluta
			nulla asperiores eum quam doloribus provident voluptatum
			repellendus? Natus, similique temporibus! Architecto magni delectus
			facere? Lorem ipsum dolor sit, amet consectetur adipisicing elit.
			Iste est aperiam magnam saepe tempore, soluta nulla asperiores eum
			quam doloribus provident voluptatum repellendus? Natus, similique
			temporibus! Architecto magni delectus facere? Lorem ipsum dolor sit,
			amet consectetur adipisicing elit. Iste est aperiam magnam saepe
			tempore, soluta nulla asperiores eum quam doloribus provident
			voluptatum repellendus? Natus, similique temporibus! Architecto
			magni delectus facere?
		</div>
	);
};

export default Page;
