import {
	PipeTransform,
	ArgumentMetadata,
	BadRequestException,
} from "@nestjs/common";
import { ZodError, z } from "zod";
import { TestPipeDto } from "../dto/test-pipe.dto";

export class ZodValidationPipe
	implements
		PipeTransform<
			TestPipeDto,
			{
				value: TestPipeDto;
				type: "body" | "query" | "param" | "custom";
			}
		>
{
	constructor(private schema: z.ZodType<TestPipeDto>) {}

	transform(
		value: unknown,
		metadata: ArgumentMetadata
	): {
		value: TestPipeDto;
		type: "body" | "query" | "param" | "custom";
	} {
		try {
			const parsedValue = this.schema.parse(value);
			return {
				value: parsedValue as TestPipeDto,
				type: metadata.type,
			};
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException(
					error.issues[0]?.message || "Validation failed"
				);
			}
			throw new BadRequestException("Validation failed");
		}
	}
}
