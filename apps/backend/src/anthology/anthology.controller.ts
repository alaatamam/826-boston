import {
  Controller,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Story } from '../story/story.entity';

@ApiTags('Anthologies')
@ApiBearerAuth()
@Controller('anthologies')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(CurrentUserInterceptor)
export class AnthologyController {
  constructor(private readonly anthologyService: AnthologyService) {}

  @Get('/:id')
  async getAnthology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Anthology> {
    return this.anthologyService.findOne(id);
  }

  @Get()
  async getAllAnthologies(): Promise<Anthology[]> {
    return this.anthologyService.findAll();
  }

  @Delete('/:id')
  async removeAnthology(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Anthology> {
    return this.anthologyService.remove(id);
  }

  @Get('/:id/stories')
  @ApiOperation({ summary: 'Get all stories for a specific anthology' })
  @ApiResponse({
    status: 200,
    description: 'Stories retrieved successfully',
    type: [Story],
  })
  @ApiResponse({
    status: 404,
    description: 'Anthology not found',
  })
  async getAnthologyStories(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Story[]> {
    return this.anthologyService.getStories(id);
  }
}
