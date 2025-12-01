import { Injectable } from "@nestjs/common";
import type { PrismaService } from "@/recipes/prisma/prisma.service";
import type { CreatePerformanceDto } from "./dto/create-performance.dto";

@Injectable()
export class PerformancesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPerformanceDto: CreatePerformanceDto) {
    const { score, ownerId } = createPerformanceDto;
    return await this.prismaService.performance.create({
      data: {
        score,
        ownerId,
      },
    });
  }

  async findAll() {
    return await this.prismaService.performance.findMany({
      include: {
        owner: {
          include: {
            roles: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} performance`;
  }

  // update(updatePerformanceDto: UpdatePerformanceDto) {
  // 	return `This action updates a #${id} performance`;
  // }

  async remove(id: number) {
    return await this.prismaService.performance.delete({
      where: {
        id,
      },
    });
  }
}
