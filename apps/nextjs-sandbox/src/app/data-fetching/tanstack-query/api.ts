import axios from "axios";

export async function fetchPokemon(id: number) {
	const res = await axios.get(`https://dummyapi.online/api/pokemon/${id}`);
	return res.data;
}
