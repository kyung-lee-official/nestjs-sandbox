import {
	PipeTransform,
	ArgumentMetadata,
	BadRequestException,
} from "@nestjs/common";
import { ZodError, z } from "zod";
import { CreateMemberDto } from "../dto/create-member.dto";

export class CreateMemberPipe
	implements PipeTransform<CreateMemberDto, CreateMemberDto>
{
	constructor(private schema: z.ZodType<CreateMemberDto>) {}

	transform(value: unknown, metadata: ArgumentMetadata): CreateMemberDto {
		try {
			const parsedValue = this.schema.parse(value);
			return parsedValue as CreateMemberDto;
		} catch (error) {
			if (error instanceof ZodError) {
				throw new BadRequestException(
					error.issues[0]?.message || "Validation failed",
				);
			}
			throw new BadRequestException("Validation failed");
		}
	}
}
