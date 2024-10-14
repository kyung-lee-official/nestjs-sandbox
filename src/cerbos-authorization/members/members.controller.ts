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
} from "@nestjs/common";
import { MembersService } from "./members.service";
import { CreateMemberDto, createMemberSchema } from "./dto/create-member.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	createMemberBodyOptions,
	createMemberOperationOptions,
} from "./swagger/create-member.swagger";
import { UpdateMemberDto } from "./dto/update-member.dto";
import { CreateMemberPipe } from "./pipes/create-member.pipe";
import { CerbosGuard } from "../guards/cerbos.guard";
import { JwtGuard } from "../authnetication/guards/jwt.guard";

@UseGuards(JwtGuard)
@Controller("members")
export class MembersController {
	constructor(private readonly membersService: MembersService) {}

	@ApiTags("Members")
	@ApiOperation(createMemberOperationOptions)
	@ApiBody(createMemberBodyOptions)
	@UsePipes(new CreateMemberPipe(createMemberSchema))
	@Post()
	async create(@Body() createMemberDto: CreateMemberDto) {
		return await this.membersService.create(createMemberDto);
	}

	@ApiTags("Members")
	@ApiBearerAuth()
	@Get()
	async findAll() {
		return await this.membersService.findAll();
	}

	@ApiTags("Members")
	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.membersService.findOne(+id);
	}

	@ApiTags("Members")
	@Patch(":id")
	update(@Param("id") id: string, @Body() updateMemberDto: UpdateMemberDto) {
		return this.membersService.update(+id, updateMemberDto);
	}

	@ApiTags("Members")
	@UseGuards(CerbosGuard)
	@Delete(":id")
	async remove(@Param("id") id: string) {
		return await this.membersService.remove(id);
	}
}
