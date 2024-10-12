import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
} from "@nestjs/common";
import { MembersService } from "./members.service";
import { CreateMemberDto, createMemberSchema } from "./dto/create-member.dto";
import { ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { SignUpPipe } from "./pipes/sign-up.pipe";
import { CreateMemberOptions, RemoveMemberOptions } from "./swagger/swagger";

@Controller("members")
export class MembersController {
	constructor(private readonly membersService: MembersService) {}

	@ApiOperation({
		summary: "Sign up",
		description: "# Sign up",
	})
	@ApiBody(CreateMemberOptions)
	@Post("sign-up")
	@UsePipes(new SignUpPipe(createMemberSchema))
	async create(@Body() createMemberDto: CreateMemberDto) {
		return this.membersService.create(createMemberDto);
	}

	@ApiOperation({
		summary: "Find all",
		description: "# Find all",
	})
	@Get()
	async findAll() {
		return this.membersService.findAll();
	}

	// @Get(":id")
	// findOne(@Param("id") id: string) {
	// 	return this.membersService.findOne(+id);
	// }

	// @Patch(":id")
	// update(@Param("id") id: string, @Body() updateMemberDto: UpdateMemberDto) {
	// 	return this.membersService.update(+id, updateMemberDto);
	// }

	@ApiOperation({
		summary: "Remove",
		description: "# Remove",
	})
	@ApiParam(RemoveMemberOptions)
	@Delete(":id")
	async remove(@Param("id") id: string) {
		return this.membersService.remove(id);
	}
}
