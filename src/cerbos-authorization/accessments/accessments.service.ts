import { Injectable } from "@nestjs/common";
import { UpdateAccessmentByIdDto } from "./dto/update-accessment.dto";
import { GetAccessmentByIdDto } from "./dto/get-accessment-by-id.dto";

@Injectable()
export class AccessmentsService {
	getAccessmentById(getAccessmentByIdDto: GetAccessmentByIdDto) {
		return `This action returns all accessments`;
	}

	updateAccessmentById(
		id: number,
		updateAccessmentDto: UpdateAccessmentByIdDto
	) {
		return `This action updates a #${id} accessment`;
	}
}
