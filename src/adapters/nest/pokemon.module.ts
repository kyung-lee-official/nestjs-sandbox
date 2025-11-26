import { Module } from "@nestjs/common";
import { PokemonAdapterController } from "./pokemon.adapter";
import { PokemonService } from "./pokemon.service";

@Module({
	controllers: [PokemonAdapterController],
	providers: [PokemonService],
})
export class PokemonModule {}
