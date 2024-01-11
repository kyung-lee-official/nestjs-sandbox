import { Injectable } from "@nestjs/common";
import { UpdateOverviewDto } from "./dto/update-overview.dto";

@Injectable()
export class OverviewService {
	testInterceptor(req: Request) {
		console.log(req.headers);
		console.log((req as any).beforeHandlerData);
		return {};
	}

	findAll() {
		return `This action returns all overview`;
	}

	findOne(id: number) {
		return `This action returns a #${id} overview`;
	}

	update(id: number, updateOverviewDto: UpdateOverviewDto) {
		return `This action updates a #${id} overview`;
	}

	remove(id: number) {
		return `This action removes a #${id} overview`;
	}
}
