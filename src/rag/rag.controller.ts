import { Body, Controller, Post } from '@nestjs/common';
import { RagService } from './rag.service';
import { AskRequestDto } from './dto/ask-request.dto';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('ask')
  async ask(@Body() body: AskRequestDto) {
    const result = await this.ragService.askAboutNotebook(
      body.question,
      body.notebookId,
    );
    return result;
  }
}
