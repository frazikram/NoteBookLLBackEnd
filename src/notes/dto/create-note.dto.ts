import { IsString, MaxLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsString()
  content: string;
}
