import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { LibraryService } from './library.service';
import { Library } from './library.entity';
import { Anthology } from '../anthology/anthology.entity';
import { AnthologyStatus, AnthologyPubLevel } from '../anthology/types';
import { AnthologyService } from '../anthology/anthology.service';
import { CreateAnthologyDto } from '../anthology/dtos/create-anthology.dto';

describe('LibraryService', () => {
  let service: LibraryService;

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

  const mockAnthologyService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibraryService,
        {
          provide: getRepositoryToken(Library),
          useValue: mockRepository,
        },
        {
          provide: AnthologyService,
          useValue: mockAnthologyService,
        },
      ],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
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

  describe('createAnthology', () => {
    const createAnthologyDto: CreateAnthologyDto = {
      title: 'New Test Anthology',
      description: 'A newly created test anthology',
      published_year: 2024,
      status: AnthologyStatus.DRAFTING,
      pub_level: AnthologyPubLevel.ZINE,
      programs: ['New Program'],
      inventory: 50,
      photo_url: 'https://example.com/new-photo.jpg',
      genre: 'Mystery',
      theme: 'Suspense',
      isbn: '9876543210',
      shopify_url: 'https://shopify.com/new-test',
    };

    it('should create an anthology and add it to library', async () => {
      const newAnthology = {
        ...mockAnthology,
        id: 2,
        title: 'New Test Anthology',
      };
      const updatedLibrary = {
        ...mockLibrary,
        anthologies: [...mockLibrary.anthologies, newAnthology],
      };

      mockRepository.findOneBy.mockResolvedValue(mockLibrary);
      mockAnthologyService.create.mockResolvedValue(newAnthology);
      mockRepository.save.mockResolvedValue(updatedLibrary);

      const result = await service.createAnthology(1, createAnthologyDto);

      expect(result).toEqual(newAnthology);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(mockAnthologyService.create).toHaveBeenCalledWith(
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
      expect(mockRepository.save).toHaveBeenCalledWith(updatedLibrary);
    });

    it('should throw NotFoundException when library does not exist', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.createAnthology(999, createAnthologyDto),
      ).rejects.toThrow(new NotFoundException('Library not found'));
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
      expect(mockAnthologyService.create).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should create anthology with minimal required fields', async () => {
      const minimalDto: CreateAnthologyDto = {
        title: 'Minimal Anthology',
        description: 'Minimal description',
        published_year: 2024,
        status: AnthologyStatus.NOT_STARTED,
        pub_level: AnthologyPubLevel.CHAPBOOK,
      };

      const newAnthology = {
        ...mockAnthology,
        id: 3,
        title: 'Minimal Anthology',
      };
      const updatedLibrary = {
        ...mockLibrary,
        anthologies: [...mockLibrary.anthologies, newAnthology],
      };

      mockRepository.findOneBy.mockResolvedValue(mockLibrary);
      mockAnthologyService.create.mockResolvedValue(newAnthology);
      mockRepository.save.mockResolvedValue(updatedLibrary);

      const result = await service.createAnthology(1, minimalDto);

      expect(result).toEqual(newAnthology);
      expect(mockAnthologyService.create).toHaveBeenCalledWith(
        minimalDto.title,
        minimalDto.description,
        minimalDto.published_year,
        minimalDto.status,
        minimalDto.pub_level,
        undefined, // programs
        undefined, // inventory
        undefined, // photo_url
        undefined, // genre
        undefined, // theme
        undefined, // isbn
        undefined, // shopify_url
      );
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
