import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotebooksService } from '../notebooks/notebooks.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notebooksService: NotebooksService,
  ) {}

  async create(notebookId: string, dto: CreateNoteDto) {
    // Ensure notebook exists
    await this.notebooksService.findOne(notebookId);

    return this.prisma.note.create({
      data: {
        notebookId,
        title: dto.title,
        content: dto.content,
      },
    });
  }

  async findForNotebook(notebookId: string) {
    // Ensure notebook exists
    await this.notebooksService.findOne(notebookId);

    return this.prisma.note.findMany({
      where: { notebookId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.note.findUnique({
      where: { id },
    });

    if (!note) throw new NotFoundException('Note not found');

    return note;
  }

  async update(id: string, dto: UpdateNoteDto) {
    await this.findOne(id);

    return this.prisma.note.update({
      where: { id },
      data: {
        title: dto.title,
        content: dto.content,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.note.delete({
      where: { id },
    });

    return { deleted: true };
  }
}
