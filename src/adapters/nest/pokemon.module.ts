import { Module } from "@nestjs/common";
import { PokemonAdapterController } from "./pokemon.adapter";

@Module({
	controllers: [PokemonAdapterController],
})
export class PokemonModule {}
