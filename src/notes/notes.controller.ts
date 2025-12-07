import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Controller()
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // Create note in a notebook
  @Post('notebooks/:notebookId/notes')
  create(
    @Param('notebookId') notebookId: string,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(notebookId, dto);
  }

  // List notes in a notebook
  @Get('notebooks/:notebookId/notes')
  findForNotebook(@Param('notebookId') notebookId: string) {
    return this.notesService.findForNotebook(notebookId);
  }

  // Get single note
  @Get('notes/:id')
  findOne(@Param('id') id: string) {
    return this.notesService.findOne(id);
  }

  // Update note
  @Patch('notes/:id')
  update(@Param('id') id: string, @Body() dto: UpdateNoteDto) {
    return this.notesService.update(id, dto);
  }

  // Delete note
  @Delete('notes/:id')
  remove(@Param('id') id: string) {
    return this.notesService.remove(id);
  }
}
