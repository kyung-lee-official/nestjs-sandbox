import {
	PipeTransform,
	ArgumentMetadata,
	BadRequestException,
} from "@nestjs/common";
import { ZodError, z } from "zod";
import { CreateRoleDto } from "../dto/create-role.dto";

export class CreateRolePipe
	implements PipeTransform<CreateRoleDto, CreateRoleDto>
{
	constructor(private schema: z.ZodType<CreateRoleDto>) {}

	transform(value: unknown, metadata: ArgumentMetadata): CreateRoleDto {
		try {
			const parsedValue = this.schema.parse(value);
			return parsedValue as CreateRoleDto;
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
