import { Test, TestingModule } from '@nestjs/testing';
import { BenefitsService } from './benefits.service';
import Benefit from '../models/benefits/benefits';
import { mockBenefitModel } from '../mocks/model.mock';
import { getModelToken } from '@nestjs/sequelize';
import { BenefitCreationAttrs } from '../types/benefits.types';

describe('BenefitsService', () => {
  let service: BenefitsService;

  const exampleBenefit = { id: 1, name: 'Vale Refeição', isActive: true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BenefitsService,
        {
          provide: getModelToken(Benefit),
          useValue: mockBenefitModel,
        },
      ],
    }).compile();

    service = module.get<BenefitsService>(BenefitsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of benefits', async () => {
      mockBenefitModel.findAll.mockResolvedValue([exampleBenefit]);

      const benefits = await service.findAll();

      expect(benefits).toEqual({
        data: [exampleBenefit],
        total: 1,
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated benefits when page and limit are provided', async () => {
      const paginatedResult = {
        rows: [exampleBenefit],
        count: 5,
      };

      mockBenefitModel.findAndCountAll.mockResolvedValue(paginatedResult);

      const page = 1;
      const limit = 2;

      const result = await service.findAll(page, limit);

      expect(mockBenefitModel.findAndCountAll).toHaveBeenCalledWith({
        limit,
        offset: (page - 1) * limit,
      });

      expect(result).toEqual({
        data: [exampleBenefit],
        total: 5,
        page,
        limit,
      });
    });
  });

  describe('create', () => {
    it('should create a benefit successfully', async () => {
      mockBenefitModel.create.mockResolvedValue(exampleBenefit);
      const benefit = await service.create({ name: 'Vale Refeição' });
      expect(benefit).toEqual(exampleBenefit);
    });

    it('should throw error with invalid payload', async () => {
      mockBenefitModel.create.mockRejectedValue(new Error('Invalid payload'));
      await expect(
        service.create({ name: '' } as BenefitCreationAttrs),
      ).rejects.toThrow('Invalid payload');
    });
  });

  describe('findOne', () => {
    it('should return a benefit by ID', async () => {
      mockBenefitModel.findByPk.mockResolvedValue(exampleBenefit);
      const benefit = await service.findOne(1);
      expect(benefit).toEqual(exampleBenefit);
    });

    it('should throw error if ID does not exist', async () => {
      mockBenefitModel.findByPk.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a benefit', async () => {
      mockBenefitModel.findByPk.mockResolvedValue({
        ...exampleBenefit,
        update: jest
          .fn()
          .mockResolvedValue({ ...exampleBenefit, name: 'Novo Nome' }),
      });
      const benefit = await service.update(1, { name: 'Novo Nome' });
      expect(benefit.name).toBe('Novo Nome');
    });

    it('should throw error if benefit not found', async () => {
      mockBenefitModel.findByPk.mockResolvedValue(null);
      await expect(service.update(999, { name: 'Erro' })).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove a benefit', async () => {
      const destroyMock = jest.fn();
      mockBenefitModel.findByPk.mockResolvedValue({ destroy: destroyMock });
      await service.remove(1);
      expect(destroyMock).toHaveBeenCalled();
    });

    it('should throw error if benefit not found', async () => {
      mockBenefitModel.findByPk.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow();
    });
  });

  describe('activate / deactivate', () => {
    it('should activate a benefit', async () => {
      const updateMock = jest
        .fn()
        .mockResolvedValue({ ...exampleBenefit, isActive: true });
      mockBenefitModel.findByPk.mockResolvedValue({
        ...exampleBenefit,
        update: updateMock,
      });
      const benefit = await service.activate(1);
      expect(benefit.isActive).toBe(true);
    });

    it('should deactivate a benefit', async () => {
      const updateMock = jest
        .fn()
        .mockResolvedValue({ ...exampleBenefit, isActive: false });
      mockBenefitModel.findByPk.mockResolvedValue({
        ...exampleBenefit,
        update: updateMock,
      });
      const benefit = await service.deactivate(1);
      expect(benefit.isActive).toBe(false);
    });

    it('should throw error if benefit not found', async () => {
      mockBenefitModel.findByPk.mockResolvedValue(null);
      await expect(service.activate(999)).rejects.toThrow();
      await expect(service.deactivate(999)).rejects.toThrow();
    });
  });
});
