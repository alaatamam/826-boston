import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { Library } from './library.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Library])],
  controllers: [LibraryController],
  providers: [LibraryService],
})
export class LibraryModule {}
