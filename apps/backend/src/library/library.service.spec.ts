import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { LibraryService } from './library.service';
import { Library } from './library.entity';
import { Anthology } from '../anthology/anthology.entity';
import { AnthologyStatus, AnthologyPubLevel } from '../anthology/types';

describe('LibraryService', () => {
  let service: LibraryService;
  let repository: Repository<Library>;

  const mockAnthology: Anthology = {
    id: 1,
    title: 'Test Anthology',
    description: 'A test anthology',
    published_year: 2023,
    status: AnthologyStatus.CAN_BE_SHARED,
    pub_level: AnthologyPubLevel.PERFECT_BOUND,
    programs: ['Test Program'],
    inventory: 100,
    photo_url: 'https://example.com/photo.jpg',
    genre: 'Fiction',
    theme: 'Adventure',
    isbn: '1234567890',
    shopify_url: 'https://shopify.com/test',
  };

  const mockLibrary: Library = {
    id: 1,
    anthologies: [mockAnthology],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        {
          provide: getRepositoryToken(Library),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
    repository = module.get<Repository<Library>>(getRepositoryToken(Library));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAnthologies', () => {
    it('should return anthologies when library exists', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockLibrary);

      const result = await service.getAnthologies(1);

      expect(result).toEqual([mockAnthology]);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return empty array when library has no anthologies', async () => {
      const emptyLibrary = { id: 1, anthologies: [] };
      mockRepository.findOneBy.mockResolvedValue(emptyLibrary);

      const result = await service.getAnthologies(1);

      expect(result).toEqual([]);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when library does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.getAnthologies(999)).rejects.toThrow(
        new NotFoundException('Library not found'),
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it('should handle multiple anthologies', async () => {
      const multipleAnthologies = [
        mockAnthology,
        {
          ...mockAnthology,
          id: 2,
          title: 'Second Anthology',
        },
        {
          ...mockAnthology,
          id: 3,
          title: 'Third Anthology',
        },
      ];

      const libraryWithMultipleAnthologies = {
        id: 1,
        anthologies: multipleAnthologies,
      };

      mockRepository.findOneBy.mockResolvedValue(
        libraryWithMultipleAnthologies,
      );

      const result = await service.getAnthologies(1);

      expect(result).toEqual(multipleAnthologies);
      expect(result).toHaveLength(3);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('findOne', () => {
    it('should return library when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockLibrary);

      const result = await service.findOne(1);

      expect(result).toEqual(mockLibrary);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when library not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });

    it('should return null when id is falsy', async () => {
      const result = await service.findOne(0);

      expect(result).toBeNull();
      expect(mockRepository.findOneBy).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new library', async () => {
      const anthologies = [mockAnthology];
      const newLibrary = { id: 1, anthologies };

      mockRepository.count.mockResolvedValue(0);
      mockRepository.create.mockReturnValue(newLibrary);
      mockRepository.save.mockResolvedValue(newLibrary);

      const result = await service.create(anthologies);

      expect(result).toEqual(newLibrary);
      expect(mockRepository.create).toHaveBeenCalledWith({
        id: 1,
        anthologies,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(newLibrary);
    });
  });

  describe('remove', () => {
    it('should remove library when found', async () => {
      mockRepository.findOneBy.mockResolvedValue(mockLibrary);
      mockRepository.remove.mockResolvedValue(mockLibrary);

      const result = await service.remove(1);

      expect(result).toEqual(mockLibrary);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockLibrary);
    });

    it('should throw NotFoundException when library not found', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(
        new NotFoundException('Library not found'),
      );
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
