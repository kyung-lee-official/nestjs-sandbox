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
	UseGuards,
} from "@nestjs/common";
import { OverviewService } from "./overview.service";
import { UpdateOverviewDto } from "./dto/update-overview.dto";
import { TestInterceptor } from "./interceptors/test.interceptor";
import { ApiOperation } from "@nestjs/swagger";
import { TestGuard } from "./guards/test.guard";

@Controller("overview")
export class OverviewController {
	constructor(private readonly overviewService: OverviewService) {}

	@ApiOperation({
		summary: "test middleware",
		description: "# Test Middleware.",
	})
	@Get("middleware")
	testMiddleware(@Req() req: Request) {
		return this.overviewService.testMiddleware(req);
	}

	@ApiOperation({
		summary: "test guard",
		description: `# Test Guard
Note that we can modify the request object in the guard.`,
	})
	@UseGuards(TestGuard)
	@Get("guard")
	testGuard(@Req() req: Request) {
		return this.overviewService.testGuard(req);
	}

	@ApiOperation({
		summary: "test interceptor",
		description: `# Test Interceptor
Check the console log and the returned data.`,
	})
	@UseInterceptors(TestInterceptor)
	@Post("interceptors")
	testInterceptor(@Req() req: Request) {
		return this.overviewService.testInterceptor(req);
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
