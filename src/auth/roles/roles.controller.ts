import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { RolesService } from "./roles.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";
import { CreateRoleOptions, RemoveRoleOptions } from "./swagger/swagger";

@Controller("roles")
export class RolesController {
	constructor(private readonly rolesService: RolesService) {}

	@ApiOperation({
		summary: "Create",
		description: "# Create",
	})
	@ApiBody(CreateRoleOptions)
	@Post()
	async create(@Body() createRoleDto: CreateRoleDto) {
		return this.rolesService.create(createRoleDto);
	}

	@Get()
	async findAll() {
		return this.rolesService.findAll();
	}

	// @Get(":id")
	// findOne(@Param("id") id: string) {
	// 	return this.rolesService.findOne(+id);
	// }

	// @Patch(":id")
	// update(@Param("id") id: string, @Body() updateRoleDto: UpdateRoleDto) {
	// 	return this.rolesService.update(+id, updateRoleDto);
	// }

	@ApiOperation({
		summary: "Remove",
		description: "# Remove",
	})
	@ApiParam(RemoveRoleOptions)
	@Delete(":id")
	async remove(@Param("id") id: string) {
		return this.rolesService.remove(id);
	}
}
