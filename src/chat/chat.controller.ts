import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Create a new chat session (optionally tied to a notebook)
  @Post('sessions')
  createSession(@Body() dto: CreateSessionDto) {
    return this.chatService.createSession(dto);
  }

  // List chat sessions, optionally filtered by notebook
  @Get('sessions')
  listSessions(@Query('notebookId') notebookId?: string) {
    return this.chatService.listSessions(notebookId);
  }

  // Get messages for a session
  @Get('sessions/:id/messages')
  listMessages(@Param('id') id: string) {
    return this.chatService.listMessages(id);
  }

  // Send a message in a session
  @Post('sessions/:id/messages')
  sendMessage(
    @Param('id') id: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(id, dto);
  }
}
