import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	UseGuards,
	ParseIntPipe,
} from "@nestjs/common";
import { PerformancesService } from "./performances.service";
import {
	CreatePerformanceDto,
	createPerformanceSchema,
} from "./dto/create-performance.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	createPerformanceBodyOptions,
	createPerformanceOperationOptions,
} from "./swagger/create-performance.swagger";
import { CreatePerformancePipe } from "./pipes/create-performance.pipe";
import { JwtGuard } from "../authnetication/guards/jwt.guard";
import { DeleteCerbosGuard } from "./guards/delete.guard";
import { GetCerbosGuard } from "./guards/get.guard";

@ApiTags("Performances")
@Controller("performances")
export class PerformancesController {
	constructor(private readonly performancesService: PerformancesService) {}

	@ApiOperation(createPerformanceOperationOptions)
	@ApiBody(createPerformanceBodyOptions)
	@UsePipes(new CreatePerformancePipe(createPerformanceSchema))
	@Post()
	async create(@Body() createPerformanceDto: CreatePerformanceDto) {
		return await this.performancesService.create(createPerformanceDto);
	}

	@ApiOperation({ summary: "Get all performances" })
	@UseGuards(GetCerbosGuard)
	@Get()
	async findAll() {
		return await this.performancesService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.performancesService.findOne(+id);
	}

	// @Patch(":id")
	// update(@Body() updatePerformanceDto: UpdatePerformanceDto) {
	// 	return this.performancesService.update(updatePerformanceDto);
	// }

	@ApiBearerAuth()
	@ApiOperation({ summary: "Delete a performance" })
	@UseGuards(JwtGuard, DeleteCerbosGuard)
	@Delete(":id")
	async remove(@Param("id", ParseIntPipe) id: number) {
		return await this.performancesService.remove(id);
	}
}
