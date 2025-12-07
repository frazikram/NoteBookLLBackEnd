import { IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsOptional()
  @IsString()
  notebookId?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
