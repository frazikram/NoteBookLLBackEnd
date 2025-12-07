import { Body, Controller, Post } from '@nestjs/common';
import { LlmService } from './llm.service';
import { ChatRequestDto } from './dto/chat-request.dto';

@Controller('llm')
export class LlmController {
  constructor(private readonly llmService: LlmService) {}

  @Post('chat')
  async chat(@Body() body: ChatRequestDto) {
    const reply = await this.llmService.chat({
      userMessage: body.message,
      systemPrompt: body.systemPrompt,
      history: body.history,
    });

    return { reply };
  }
}
