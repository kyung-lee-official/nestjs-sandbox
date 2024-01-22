import {
	PipeTransform,
	ArgumentMetadata,
	BadRequestException,
} from "@nestjs/common";
import { ZodError, ZodSchema } from "zod";
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
	constructor(private schema: ZodSchema) {}

	transform(value: unknown, metadata: ArgumentMetadata) {
		try {
			const parsedValue = this.schema.parse(value);
			return {
				value: parsedValue,
				type: metadata.type,
			};
		} catch (error) {
			throw new BadRequestException(
				(error as ZodError).errors[0].message
			);
		}
	}
}
