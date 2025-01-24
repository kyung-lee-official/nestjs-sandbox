import { Injectable } from "@nestjs/common";
import { UpdateAssessmentByIdDto } from "./dto/update-assessment.dto";
import { GetAssessmentByIdDto } from "./dto/get-assessment-by-id.dto";

@Injectable()
export class AssessmentsService {
	getAssessmentById(getAssessmentByIdDto: GetAssessmentByIdDto) {
		return `This action returns all assessments`;
	}

	updateAssessmentById(
		id: number,
		updateAssessmentDto: UpdateAssessmentByIdDto
	) {
		return `This action updates a #${id} assessment`;
	}
}
