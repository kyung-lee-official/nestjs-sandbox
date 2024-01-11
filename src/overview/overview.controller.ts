import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
	Req,
} from "@nestjs/common";
import { OverviewService } from "./overview.service";
import { UpdateOverviewDto } from "./dto/update-overview.dto";
import { TestInterceptor } from "./interceptors/test.interceptor";
import { ApiOperation } from "@nestjs/swagger";

@Controller("overview")
export class OverviewController {
	constructor(private readonly overviewService: OverviewService) {}

	@ApiOperation({
		summary: "test interceptor",
		description:
			"Test interceptor. Check the console log and the returned data.",
	})
	@UseInterceptors(TestInterceptor)
	@Post("interceptors")
	testInterceptor(@Req() req: Request) {
		return this.overviewService.testInterceptor(req);
	}

	@Get()
	findAll() {
		return this.overviewService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.overviewService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateOverviewDto: UpdateOverviewDto
	) {
		return this.overviewService.update(+id, updateOverviewDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.overviewService.remove(+id);
	}
}
