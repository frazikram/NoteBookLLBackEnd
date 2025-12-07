import { Module } from '@nestjs/common';
import { NotebooksService } from './notebooks.service';
import { NotebooksController } from './notebooks.controller';
import { PrismaModule } from 'prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  providers: [NotebooksService],
  controllers: [NotebooksController],
  exports: [NotebooksService],
})
export class NotebooksModule {}
