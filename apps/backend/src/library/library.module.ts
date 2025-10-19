import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { Library } from './library.entity';
import { AnthologyService } from '../anthology/anthology.service';
import { Anthology } from '../anthology/anthology.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Library, Anthology])],
  controllers: [LibraryController],
  providers: [LibraryService, AnthologyService],
})
export class LibraryModule {}
