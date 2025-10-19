import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LibraryService } from './library.service';
import { AuthGuard } from '@nestjs/passport';
import { Library } from './library.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Anthology } from '../anthology/anthology.entity';

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

  @Delete('/:id')
  removeLibrary(@Param('id') id: string) {
    return this.libraryService.remove(parseInt(id));
  }
}
