# Simple ts-rest Framework-Agnostic Implementation

This demonstrates how to write ts-rest code that's portable between frameworks.

## Architecture

```
src/
├── contracts/           # Framework-agnostic
│   └── pokemon.contract.ts
└── adapters/
    └── nest/          # NestJS-specific
        ├── pokemon.service.ts  # Business logic with DI
        ├── pokemon.adapter.ts  # HTTP adapter with DI
        └── pokemon.module.ts
```

## Key Files

### 1. Contract (Framework-Agnostic)

```typescript
// src/contracts/pokemon.contract.ts
export const pokemonContract = c.router({
	getPokemon: {
		method: "GET",
		path: "/pokemon/:id",
		responses: {
			200: PokemonSchema,
			404: z.object({ message: z.string() }),
		},
	},
});
export type Pokemon = z.infer<typeof PokemonSchema>;
```

### 2. Business Logic (NestJS Service with DI)

```typescript
// src/adapters/nest/pokemon.service.ts
@Injectable()
export class PokemonService {
	pokemonStore = new Map<string, Pokemon>();

	constructor() {
		// Initialize with sample data
		this.pokemonStore.set("1", {
			id: "1",
			name: "Pikachu",
			type: "Electric",
		});
	}

	async getPokemon(id: string): Promise<Pokemon | null> {
		return this.pokemonStore.get(id) || null;
	}
}
```

### 3. NestJS Adapter (with Dependency Injection)

```typescript
// src/adapters/nest/pokemon.adapter.ts
@Controller("pokemon")
export class PokemonAdapterController {
	constructor(private readonly pokemonService: PokemonService) {}

	@Get(":id")
	async getPokemon(@Param("id") id: string) {
		const pokemon = await this.pokemonService.getPokemon(id);
		if (!pokemon) return { statusCode: 404, message: "Pokemon not found" };
		return pokemon;
	}
}
```

## Migration to MedusaJS

When you migrate, create a MedusaJS adapter that uses the same business logic:

### Option 1: MedusaJS Service

```typescript
// For MedusaJS service
export default class PokemonMedusaService extends TransactionBaseService {
	private pokemonStore = new Map<string, Pokemon>();

	constructor(container) {
		super(container);
		// Same initialization logic
		this.pokemonStore.set("1", {
			id: "1",
			name: "Pikachu",
			type: "Electric",
		});
	}

	async getPokemon(id: string): Promise<Pokemon | null> {
		return this.pokemonStore.get(id) || null;
	}
}
```

### Option 2: MedusaJS API Route

```typescript
// For MedusaJS API routes
export async function GET(req: MedusaRequest, res: MedusaResponse) {
	const { id } = req.params;
	const pokemonService = new PokemonService(); // Or get from container
	const pokemon = await pokemonService.getPokemon(id);
	if (!pokemon) {
		res.status(404).json({ message: "Pokemon not found" });
		return;
	}
	res.json(pokemon);
}
```

## Benefits

-   **No `@ts-rest/nest` dependency** - you're not locked in
-   **Proper NestJS patterns** - using `@Injectable()` and dependency injection
-   **Framework-agnostic contracts** - same contracts work in both frameworks
-   **Easy to migrate** - business logic can be reused in MedusaJS

## Testing

```typescript
// Test NestJS service
describe("PokemonService", () => {
	let service: PokemonService;

	beforeEach(() => {
		service = new PokemonService();
	});

	it("should get pokemon by id", async () => {
		const pokemon = await service.getPokemon("1");
		expect(pokemon?.name).toBe("Pikachu");
	});
});
```

This approach keeps your ts-rest code portable while using proper NestJS patterns, making migration to MedusaJS straightforward.
