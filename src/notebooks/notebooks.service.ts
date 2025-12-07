import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class NotebooksService {
  constructor(private readonly prisma: PrismaService) {}

  // For now: single demo user so we don't need auth yet
  private async getOrCreateDemoUser() {
    const email = 'demo@local';
    const user = await this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: 'Demo User' },
    });
    return user;
  }

  async create(dto: CreateNotebookDto) {
    const user = await this.getOrCreateDemoUser();

    return this.prisma.notebook.create({
      data: {
        userId: user.id,
        title: dto.title,
        description: dto.description,
      },
    });
  }

  async findAll() {
    const user = await this.getOrCreateDemoUser();

    return this.prisma.notebook.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const notebook = await this.prisma.notebook.findUnique({
      where: { id },
    });

    if (!notebook) {
      throw new NotFoundException('Notebook not found');
    }

    return notebook;
  }

  async update(id: string, dto: UpdateNotebookDto) {
    // Ensure it exists
    await this.findOne(id);

    return this.prisma.notebook.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
      },
    });
  }

  async remove(id: string) {
    // Ensure it exists
    await this.findOne(id);

    await this.prisma.notebook.delete({
      where: { id },
    });

    return { deleted: true };
  }
}
