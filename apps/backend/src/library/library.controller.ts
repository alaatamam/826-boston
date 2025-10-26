import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { AuthGuard } from '@nestjs/passport';
import { Library } from './library.entity';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Anthology } from '../anthology/anthology.entity';
import { CreateAnthologyDto } from '../anthology/dtos/create-anthology.dto';
import { UpdateAnthologyDto } from '../anthology/dtos/update-anthology.dto';

@ApiTags('Library')
@ApiBearerAuth()
@Controller('library')
@UseGuards(AuthGuard('jwt'))
export class LibraryController {
  constructor(private libraryService: LibraryService) {}

  @Get('/:libraryId')
  async getLibrary(
    @Param('libraryId', ParseIntPipe) libraryId: number,
  ): Promise<Library> {
    return this.libraryService.findOne(libraryId);
  }

  @Get('/:libraryId/anthology')
  async getLibraryAnthologies(
    @Param('libraryId', ParseIntPipe) libraryId: number,
  ): Promise<Anthology[]> {
    return this.libraryService.getAnthologies(libraryId);
  }

  @Post('/:libraryId/anthology')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new anthology in a library' })
  @ApiResponse({
    status: 201,
    description: 'Anthology created successfully',
    type: Anthology,
  })
  @ApiResponse({
    status: 404,
    description: 'Library not found',
  })
  async createAnthology(
    @Param('libraryId', ParseIntPipe) libraryId: number,
    @Body() createAnthologyDto: CreateAnthologyDto,
  ): Promise<Anthology> {
    return this.libraryService.createAnthology(libraryId, createAnthologyDto);
  }

  @Put('/anthology/:anthologyId')
  @ApiOperation({ summary: 'Update an anthology with the given id' })
  @ApiResponse({
    status: 200,
    description: 'Anthology updated successfully',
    type: Anthology,
  })
  @ApiResponse({
    status: 404,
    description: 'Anthology not found',
  })
  async updateAnthology(
    @Param('anthologyId', ParseIntPipe) anthologyId: number,
    @Body() updateAnthologyDto: UpdateAnthologyDto,
  ): Promise<Anthology> {
    return this.libraryService.updateAnthology(anthologyId, updateAnthologyDto);
  }

  @Delete('/:id')
  removeLibrary(@Param('id') id: string) {
    return this.libraryService.remove(parseInt(id));
  }
}
