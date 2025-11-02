import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { AuthGuard } from '@nestjs/passport';
import { Story } from './story.entity';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AnthologyService } from '../anthology/anthology.service';
import { CreateStoryDto } from '../anthology/dtos/create-story.dto';

@ApiTags('Story')
@ApiBearerAuth()
@Controller('story')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class StoryController {
  constructor(
    private storyService: StoryService,
    private anthologyService: AnthologyService,
  ) {}

  @Get('/library/anthology/:anthologyId/story/:storyId')
  async getStory(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.findOne(storyId);
  }

  @Delete('/:storyId')
  async removeStory(
    @Param('storyId', ParseIntPipe) storyId: number,
  ): Promise<Story> {
    return this.storyService.remove(storyId);
  }

  @Post('/library/anthology/:anthologyId/story')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new story in a specific anthology' })
  @ApiResponse({
    status: 201,
    description: 'Story created successfully',
    type: Story,
  })
  @ApiResponse({
    status: 404,
    description: 'Anthology not found',
  })
  async createStory(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Param('storyId', ParseIntPipe) storyId: number,
    @Body() createStoryDto: CreateStoryDto,
  ): Promise<Story> {
    const anthology = await this.anthologyService.findOne(anthologyId);

    if (!anthology) {
      throw new NotFoundException('Anthology not found');
    }

    return this.storyService.createStory(
      createStoryDto.title,
      createStoryDto.author,
      createStoryDto.student_bio,
      createStoryDto.description,
      createStoryDto.genre,
      createStoryDto.theme,
      anthologyId,
    );
  }
}
