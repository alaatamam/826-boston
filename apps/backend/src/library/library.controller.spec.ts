import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { Library } from './library.entity';
import { Anthology } from '../anthology/anthology.entity';
import { AnthologyStatus, AnthologyPubLevel } from '../anthology/types';
import { CreateAnthologyDto } from '../anthology/dtos/create-anthology.dto';

describe('LibraryController', () => {
  let controller: LibraryController;

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

  const mockLibraryService = {
    findOne: jest.fn(),
    getAnthologies: jest.fn(),
    remove: jest.fn(),
    createAnthology: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryController],
      providers: [
        {
          provide: LibraryService,
          useValue: mockLibraryService,
        },
      ],
    }).compile();

    controller = module.get<LibraryController>(LibraryController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLibrary', () => {
    it('should return a library when found', async () => {
      mockLibraryService.findOne.mockResolvedValue(mockLibrary);

      const result = await controller.getLibrary(1);

      expect(result).toEqual(mockLibrary);
      expect(mockLibraryService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when library not found', async () => {
      mockLibraryService.findOne.mockResolvedValue(null);

      const result = await controller.getLibrary(999);

      expect(result).toBeNull();
      expect(mockLibraryService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('getLibraryAnthologies', () => {
    it('should return anthologies array when library exists', async () => {
      mockLibraryService.getAnthologies.mockResolvedValue([mockAnthology]);

      const result = await controller.getLibraryAnthologies(1);

      expect(result).toEqual([mockAnthology]);
      expect(mockLibraryService.getAnthologies).toHaveBeenCalledWith(1);
    });

    it('should return empty array when library has no anthologies', async () => {
      mockLibraryService.getAnthologies.mockResolvedValue([]);

      const result = await controller.getLibraryAnthologies(1);

      expect(result).toEqual([]);
      expect(mockLibraryService.getAnthologies).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when library does not exist', async () => {
      mockLibraryService.getAnthologies.mockRejectedValue(
        new NotFoundException('Library not found'),
      );

      await expect(controller.getLibraryAnthologies(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLibraryService.getAnthologies).toHaveBeenCalledWith(999);
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

      mockLibraryService.getAnthologies.mockResolvedValue(multipleAnthologies);

      const result = await controller.getLibraryAnthologies(1);

      expect(result).toEqual(multipleAnthologies);
      expect(result).toHaveLength(3);
      expect(mockLibraryService.getAnthologies).toHaveBeenCalledWith(1);
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

    it('should create an anthology successfully', async () => {
      const newAnthology = {
        ...mockAnthology,
        id: 2,
        title: 'New Test Anthology',
      };
      mockLibraryService.createAnthology.mockResolvedValue(newAnthology);

      const result = await controller.createAnthology(1, createAnthologyDto);

      expect(result).toEqual(newAnthology);
      expect(mockLibraryService.createAnthology).toHaveBeenCalledWith(
        1,
        createAnthologyDto,
      );
    });

    it('should throw NotFoundException when library does not exist', async () => {
      mockLibraryService.createAnthology.mockRejectedValue(
        new NotFoundException('Library not found'),
      );

      await expect(
        controller.createAnthology(999, createAnthologyDto),
      ).rejects.toThrow(NotFoundException);
      expect(mockLibraryService.createAnthology).toHaveBeenCalledWith(
        999,
        createAnthologyDto,
      );
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
      mockLibraryService.createAnthology.mockResolvedValue(newAnthology);

      const result = await controller.createAnthology(1, minimalDto);

      expect(result).toEqual(newAnthology);
      expect(mockLibraryService.createAnthology).toHaveBeenCalledWith(
        1,
        minimalDto,
      );
    });
  });

  describe('removeLibrary', () => {
    it('should remove a library successfully', async () => {
      mockLibraryService.remove.mockResolvedValue(mockLibrary);

      const result = await controller.removeLibrary('1');

      expect(result).toEqual(mockLibrary);
      expect(mockLibraryService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when library does not exist', async () => {
      mockLibraryService.remove.mockRejectedValue(
        new NotFoundException('Library not found'),
      );

      await expect(controller.removeLibrary('999')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockLibraryService.remove).toHaveBeenCalledWith(999);
    });
  });
});
