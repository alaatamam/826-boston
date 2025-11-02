import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty({ description: 'Title of the story' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the story' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Author of story' })
  @IsString()
  author: string;

  @ApiProperty({ description: 'Student bio of story' })
  @IsString()
  @IsOptional()
  student_bio: string;

  @ApiProperty({ description: 'Genre of story' })
  @IsString()
  @IsOptional()
  genre: string;

  @ApiProperty({ description: 'Theme of story' })
  @IsString()
  @IsOptional()
  theme: string;

  @ApiProperty({ description: 'ID of Anthology the story is in' })
  @IsNumber()
  @IsOptional()
  anthology_id: number;
}
