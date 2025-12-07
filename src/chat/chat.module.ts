import { Module } from '@nestjs/common';

import { RagModule } from '../rag/rag.module';
import { LlmModule } from '../llm/llm.module';
import { NotebooksModule } from '../notebooks/notebooks.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';

@Module({
  imports: [PrismaModule, RagModule, LlmModule, NotebooksModule],
  providers: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
