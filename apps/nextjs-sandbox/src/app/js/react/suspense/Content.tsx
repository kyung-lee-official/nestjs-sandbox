const Content = async () => {
	const res = await fetch("https://dummyapi.online/api/pokemon");
	const result = await res.json();

	if (result) {
		return (
			<div>
				{result.map((pokemon: any) => (
					<div key={pokemon.id}>{pokemon.pokemon}</div>
				))}
			</div>
		);
	}
};

export default Content;
