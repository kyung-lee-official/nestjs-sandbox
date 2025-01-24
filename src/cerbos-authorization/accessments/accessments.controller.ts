import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from "@nestjs/common";
import { AccessmentsService } from "./accessments.service";
import { GetAccessmentByIdGuard } from "./guard/get-accessment-by-id.guard";
import {
	GetAccessmentByIdDto,
	getAccessmentByIdSchema,
} from "./dto/get-accessment-by-id.dto";
import { ZodValidationPipe } from "src/overview/pipes/zod-validation.pipe";
import { UpdateAccessmentByIdDto } from "./dto/update-accessment.dto";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	getAccessmentByIdOperationOptions,
	getAccessmentByIdOptions,
} from "./swagger/get-accessment-by-id.swagger";

@ApiTags("Accessments")
@Controller("accessments")
export class AccessmentsController {
	constructor(private readonly accessmentsService: AccessmentsService) {}

	@ApiOperation(getAccessmentByIdOperationOptions)
	@ApiBody(getAccessmentByIdOptions)
	@UseGuards(GetAccessmentByIdGuard)
	@Post()
	getAccessmentById(
		@Body(new ZodValidationPipe(getAccessmentByIdSchema))
		getAccessmentByIdDto: GetAccessmentByIdDto
	) {
		return this.accessmentsService.getAccessmentById(getAccessmentByIdDto);
	}

	@Patch(":id")
	updateAccessmentById(
		@Param("id") id: string,
		@Body() updateAccessmentDto: UpdateAccessmentByIdDto
	) {
		return this.accessmentsService.updateAccessmentById(
			+id,
			updateAccessmentDto
		);
	}
}
