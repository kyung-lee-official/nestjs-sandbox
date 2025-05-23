import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Event } from "@prisma/client";
import { CreateEventDto } from "./dto/create-event.dto";
import { JsonFieldFilterDto } from "./dto/json-field-filter";

@Injectable()
export class EventsService {
	constructor(private prisma: PrismaService) {}

	async createEvent(createEventDto: CreateEventDto): Promise<Event> {
		return await this.prisma.event.create({
			data: createEventDto,
		});
	}

	async getAllEvents(): Promise<Event[]> {
		return await this.prisma.event.findMany();
	}
}
