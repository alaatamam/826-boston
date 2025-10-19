import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Library } from './library.entity';
import { Anthology } from '../anthology/anthology.entity';
import { AnthologyService } from '../anthology/anthology.service';
import { CreateAnthologyDto } from '../anthology/dtos/create-anthology.dto';
import { Story } from '../story/story.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library) private repo: Repository<Library>,
    private anthologyService: AnthologyService,
  ) {}

  async create(anthologies: Anthology[]) {
    const libraryId = (await this.repo.count()) + 1;
    const library = this.repo.create({
      id: libraryId,
      anthologies: anthologies,
    });

    return this.repo.save(library);
  }

  findOne(id: number) {
    if (!id) {
      return null;
    }

    return this.repo.findOneBy({ id });
  }

  findAll() {
    return this.repo.find();
  }

  async update(id: number, attrs: Partial<Library>) {
    const library = await this.findOne(id);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    Object.assign(library, attrs);

    return this.repo.save(library);
  }

  async remove(id: number) {
    const library = await this.findOne(id);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    return this.repo.remove(library);
  }

  async addAnthology(id: number, anthology: Anthology | Anthology[]) {
    const library = await this.findOne(id);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    library.anthologies.concat(anthology);
    return this.repo.save(library);
  }

  async removeAnthology(id: number, anthology: Anthology) {
    const library = await this.findOne(id);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    library.anthologies.filter((a) => a !== anthology);
    return this.repo.save(library);
  }

  async getAnthologies(libraryId: number): Promise<Anthology[]> {
    const library = await this.findOne(libraryId);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    return library.anthologies;
  }

  async getAnthologyStories(anthologyId: number): Promise<Story[]> {
    return this.anthologyService.getStories(anthologyId);
  }

  async createAnthology(
    libraryId: number,
    createAnthologyDto: CreateAnthologyDto,
  ): Promise<Anthology> {
    const library = await this.findOne(libraryId);

    if (!library) {
      throw new NotFoundException('Library not found');
    }

    // Create the anthology using the AnthologyService
    const anthology = await this.anthologyService.create(
      createAnthologyDto.title,
      createAnthologyDto.description,
      createAnthologyDto.published_year,
      createAnthologyDto.status,
      createAnthologyDto.pub_level,
      createAnthologyDto.programs,
      createAnthologyDto.inventory,
      createAnthologyDto.photo_url,
      createAnthologyDto.genre,
      createAnthologyDto.theme,
      createAnthologyDto.isbn,
      createAnthologyDto.shopify_url,
    );

    // Add the anthology to the library
    library.anthologies.push(anthology);
    await this.repo.save(library);

    return anthology;
  }
}
