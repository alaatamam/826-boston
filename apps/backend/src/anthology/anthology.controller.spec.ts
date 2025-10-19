import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AnthologyController } from './anthology.controller';
import { AnthologyService } from './anthology.service';
import { Anthology } from './anthology.entity';
import { Story } from '../story/story.entity';

// mock interceptor to avoid dependency injection issues
jest.mock('../interceptors/current-user.interceptor', () => ({
  CurrentUserInterceptor: jest.fn().mockImplementation(() => ({
    intercept: jest.fn((context, next) => next.handle()), // just passes through
  })),
}));

describe('AnthologyController', () => {
  let controller: AnthologyController;

  const mockStory: Story = {
    id: 1,
    title: 'Test Story',
    description: 'A story for testing',
    author: 'Ala’a Tamam',
    student_bio: 'Data Science student',
    genre: 'Fiction',
    theme: 'Hope',
    anthology: { id: 1 } as Anthology,
  };

  const mockAnthology: Anthology = {
    id: 1,
    title: 'Test Anthology',
    description: 'A test anthology',
    published_year: 2024,
    status: 'PUBLISHED' as unknown as Anthology['status'],
    pub_level: 'PERFECT_BOUND' as unknown as Anthology['pub_level'],
    programs: ['Test Program'],
    inventory: 20,
    photo_url: 'https://example.com/photo.jpg',
    genre: 'Fiction',
    theme: 'Resilience',
    isbn: '1234567890',
    shopify_url: 'https://shopify.com/test',
  };

  const mockAnthologyService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    remove: jest.fn(),
    getStories: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnthologyController],
      providers: [
        {
          provide: AnthologyService,
          useValue: mockAnthologyService,
        },
      ],
    }).compile();

    controller = module.get<AnthologyController>(AnthologyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAnthology', () => {
    it('should return an anthology when found', async () => {
      mockAnthologyService.findOne.mockResolvedValue(mockAnthology);

      const result = await controller.getAnthology(1);

      expect(result).toEqual(mockAnthology);
      expect(mockAnthologyService.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when anthology not found', async () => {
      mockAnthologyService.findOne.mockResolvedValue(null);

      const result = await controller.getAnthology(999);

      expect(result).toBeNull();
      expect(mockAnthologyService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('getAllAnthologies', () => {
    it('should return all anthologies', async () => {
      mockAnthologyService.findAll.mockResolvedValue([mockAnthology]);

      const result = await controller.getAllAnthologies();

      expect(result).toEqual([mockAnthology]);
      expect(mockAnthologyService.findAll).toHaveBeenCalled();
    });
  });

  describe('getAnthologyStories', () => {
    it('should return an array of stories when anthology exists', async () => {
      mockAnthologyService.getStories.mockResolvedValue([mockStory]);

      const result = await controller.getAnthologyStories(1);

      expect(result).toEqual([mockStory]);
      expect(mockAnthologyService.getStories).toHaveBeenCalledWith(1);
    });

    it('should return an empty array if no stories exist', async () => {
      mockAnthologyService.getStories.mockResolvedValue([]);

      const result = await controller.getAnthologyStories(1);

      expect(result).toEqual([]);
      expect(mockAnthologyService.getStories).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when anthology not found', async () => {
      mockAnthologyService.getStories.mockRejectedValue(
        new NotFoundException('Anthology not found'),
      );

      await expect(controller.getAnthologyStories(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockAnthologyService.getStories).toHaveBeenCalledWith(999);
    });
  });

  describe('removeAnthology', () => {
    it('should remove an anthology successfully', async () => {
      mockAnthologyService.remove.mockResolvedValue(mockAnthology);

      const result = await controller.removeAnthology(1);

      expect(result).toEqual(mockAnthology);
      expect(mockAnthologyService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when anthology not found', async () => {
      mockAnthologyService.remove.mockRejectedValue(
        new NotFoundException('Anthology not found'),
      );

      await expect(controller.removeAnthology(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockAnthologyService.remove).toHaveBeenCalledWith(999);
    });
  });
});
