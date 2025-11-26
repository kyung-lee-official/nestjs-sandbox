import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

// Simple schema for demonstration
export const PokemonSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.string(),
});
export type Pokemon = z.infer<typeof PokemonSchema>;

// Simple contract with just one endpoint
export const pokemonContract = c.router({
	getPokemon: {
		method: "GET",
		path: "/pokemon/:id",
		pathParams: z.object({
			id: z.string(),
		}),
		responses: {
			200: PokemonSchema,
			404: z.object({ message: z.string() }),
		},
		summary: "Get a pokemon by id",
	},
});
