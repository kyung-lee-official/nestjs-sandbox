import { Injectable } from "@nestjs/common";
import { Pokemon } from "../../contracts/pokemon.contract";

@Injectable()
export class PokemonService {
	// Simple mock data store
	pokemonStore = new Map<string, Pokemon>();

	constructor() {
		// Initialize with simple sample data
		this.pokemonStore.set("1", {
			id: "1",
			name: "Pikachu",
			type: "Electric",
		});

		this.pokemonStore.set("2", {
			id: "2",
			name: "Charizard",
			type: "Fire",
		});
	}

	async getPokemon(id: string): Promise<Pokemon | null> {
		return this.pokemonStore.get(id) || null;
	}
}
