import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { CreateNotebookDto } from './dto/create-notebook.dto';
import { UpdateNotebookDto } from './dto/update-notebook.dto';

@Controller('notebooks')
export class NotebooksController {
  constructor(private readonly notebooksService: NotebooksService) {}

  @Post()
  create(@Body() dto: CreateNotebookDto) {
    return this.notebooksService.create(dto);
  }

  @Get()
  findAll() {
    return this.notebooksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notebooksService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNotebookDto) {
    return this.notebooksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notebooksService.remove(id);
  }
}
