import { Module } from '@nestjs/common';

import { LlmModule } from '../llm/llm.module';
import { RagService } from './rag.service';
import { RagController } from './rag.controller';
import { Prisma } from '@prisma/client';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [LlmModule, PrismaModule],
  providers: [RagService],
  controllers: [RagController],
   exports: [RagService], 
})
export class RagModule {}
