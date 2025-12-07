import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';

import { NotebooksModule } from '../notebooks/notebooks.module';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [PrismaModule, NotebooksModule],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
