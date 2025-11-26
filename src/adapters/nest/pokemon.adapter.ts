import { Controller, Get, Param, HttpStatus } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";

@Controller("pokemon")
export class PokemonAdapterController {
	constructor(private readonly pokemonService: PokemonService) {}

	@Get(":id")
	async getPokemon(@Param("id") id: string) {
		const pokemon = await this.pokemonService.getPokemon(id);
		if (!pokemon) {
			return {
				statusCode: HttpStatus.NOT_FOUND,
				message: "Pokemon not found",
			};
		}
		return pokemon;
	}
}
