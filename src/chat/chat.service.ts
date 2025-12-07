import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { RagService } from '../rag/rag.service';
import { LlmService } from '../llm/llm.service';
import { NotebooksService } from '../notebooks/notebooks.service';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ragService: RagService,
    private readonly llmService: LlmService,
    private readonly notebooksService: NotebooksService,
  ) {}

  // demo single user for now
  private async getOrCreateDemoUser() {
    const email = 'demo@local';
    return this.prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, name: 'Demo User' },
    });
  }

  async createSession(dto: CreateSessionDto) {
    const user = await this.getOrCreateDemoUser();

    let notebookId: string | null = null;
    if (dto.notebookId) {
      // ensure notebook exists
      await this.notebooksService.findOne(dto.notebookId);
      notebookId = dto.notebookId;
    }

    return this.prisma.chatSession.create({
      data: {
        userId: user.id,
        notebookId,
        title: dto.title ?? null,
      },
    });
  }

  async listSessions(notebookId?: string) {
    const user = await this.getOrCreateDemoUser();

    return this.prisma.chatSession.findMany({
      where: {
        userId: user.id,
        ...(notebookId ? { notebookId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSession(id: string) {
    const session = await this.prisma.chatSession.findUnique({
      where: { id },
    });
    if (!session) throw new NotFoundException('Chat session not found');
    return session;
  }

  async listMessages(sessionId: string) {
    await this.getSession(sessionId);

    return this.prisma.chatMessage.findMany({
      where: { chatSessionId: sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(sessionId: string, dto: SendMessageDto) {
    const session = await this.getSession(sessionId);

    // Save user message
    const userMessage = await this.prisma.chatMessage.create({
      data: {
        chatSessionId: sessionId,
        role: 'USER',
        content: dto.content,
      },
    });

    // Decide how to answer: RAG if session has notebookId, else plain LLM
    let reply: string;
    let sources: any[] | undefined;

    if (session.notebookId) {
      const ragResult = await this.ragService.askAboutNotebook(
        dto.content,
        session.notebookId,
      );
      reply = ragResult.reply;
      sources = ragResult.sources;
    } else {
      reply = await this.llmService.chat({
        userMessage: dto.content,
      });
      sources = undefined;
    }

    // Save assistant message
    const assistantMessage = await this.prisma.chatMessage.create({
      data: {
        chatSessionId: sessionId,
        role: 'ASSISTANT',
        content: reply,
      },
    });

    return {
      userMessage,
      assistantMessage,
      sources,
    };
  }
}
