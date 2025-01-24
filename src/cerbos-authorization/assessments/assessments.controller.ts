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
import { AssessmentsService } from "./assessments.service";
import { GetAssessmentByIdGuard } from "./guard/get-assessment-by-id.guard";
import {
	GetAssessmentByIdDto,
	getAssessmentByIdSchema,
} from "./dto/get-assessment-by-id.dto";
import { ZodValidationPipe } from "src/overview/pipes/zod-validation.pipe";
import { UpdateAssessmentByIdDto } from "./dto/update-assessment.dto";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	getAssessmentByIdOperationOptions,
	getAssessmentByIdOptions,
} from "./swagger/get-assessment-by-id.swagger";

@ApiTags("Assessments")
@Controller("assessments")
export class AssessmentsController {
	constructor(private readonly assessmentsService: AssessmentsService) {}

	@ApiOperation(getAssessmentByIdOperationOptions)
	@ApiBody(getAssessmentByIdOptions)
	@UseGuards(GetAssessmentByIdGuard)
	@Post()
	getAssessmentById(
		@Body(new ZodValidationPipe(getAssessmentByIdSchema))
		getAssessmentByIdDto: GetAssessmentByIdDto
	) {
		return this.assessmentsService.getAssessmentById(getAssessmentByIdDto);
	}

	@Patch(":id")
	updateAssessmentById(
		@Param("id") id: string,
		@Body() updateAssessmentDto: UpdateAssessmentByIdDto
	) {
		return this.assessmentsService.updateAssessmentById(
			+id,
			updateAssessmentDto
		);
	}
}
