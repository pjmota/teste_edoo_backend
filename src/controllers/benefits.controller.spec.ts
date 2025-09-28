import { Test, TestingModule } from '@nestjs/testing';
import { BenefitsController } from './benefits.controller';
import { BenefitsService } from '../services/benefits.service';
import { CreateBenefitDto } from '../dtos/create-benefit.dto';
import Benefit from '../models/benefits/benefits';

describe('BenefitsController', () => {
  let controller: BenefitsController;

  const mockBenefitsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn(),
    activate: jest.fn(),
    remove: jest.fn(),
  };

  const mockBenefit: Benefit = {
    id: 1,
    name: 'Vale Refeição',
    description: 'Benefício de alimentação',
    isActive: true,
  } as Benefit;

  const mockBenefits = [
    mockBenefit,
    {
      id: 2,
      name: 'Vale Transporte',
      description: 'Benefício de transporte',
      isActive: true,
    } as Benefit,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BenefitsController],
      providers: [
        {
          provide: BenefitsService,
          useValue: mockBenefitsService,
        },
      ],
    }).compile();

    controller = module.get<BenefitsController>(BenefitsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar todos os benefícios sem paginação', async () => {
      const expectedResult = { data: mockBenefits, total: 2 };
      mockBenefitsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(mockBenefitsService.findAll).toHaveBeenCalledWith(
        undefined,
        undefined,
      );
      expect(result).toEqual(expectedResult);
    });

    it('deve retornar benefícios com paginação', async () => {
      const expectedResult = {
        data: mockBenefits,
        total: 2,
        page: 1,
        limit: 10,
      };
      mockBenefitsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll('1', '10');

      expect(mockBenefitsService.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(expectedResult);
    });

    it('deve converter strings para números na paginação', async () => {
      const expectedResult = {
        data: mockBenefits,
        total: 2,
        page: 2,
        limit: 5,
      };
      mockBenefitsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll('2', '5');

      expect(mockBenefitsService.findAll).toHaveBeenCalledWith(2, 5);
      expect(result).toEqual(expectedResult);
    });

    it('deve tratar page como undefined quando não fornecido', async () => {
      const expectedResult = { data: mockBenefits, total: 2 };
      mockBenefitsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(undefined, '10');

      expect(mockBenefitsService.findAll).toHaveBeenCalledWith(undefined, 10);
      expect(result).toEqual(expectedResult);
    });

    it('deve tratar limit como undefined quando não fornecido', async () => {
      const expectedResult = { data: mockBenefits, total: 2 };
      mockBenefitsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll('1');

      expect(mockBenefitsService.findAll).toHaveBeenCalledWith(1, undefined);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findOne', () => {
    it('deve retornar um benefício pelo ID', async () => {
      mockBenefitsService.findOne.mockResolvedValue(mockBenefit);

      const result = await controller.findOne('1');

      expect(mockBenefitsService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBenefit);
    });

    it('deve converter string ID para número', async () => {
      mockBenefitsService.findOne.mockResolvedValue(mockBenefit);

      const result = await controller.findOne('123');

      expect(mockBenefitsService.findOne).toHaveBeenCalledWith(123);
      expect(result).toEqual(mockBenefit);
    });
  });

  describe('create', () => {
    it('deve criar um novo benefício', async () => {
      const createBenefitDto: CreateBenefitDto = {
        name: 'Novo Benefício',
        description: 'Descrição do novo benefício',
      };
      mockBenefitsService.create.mockResolvedValue(mockBenefit);

      const result = await controller.create(createBenefitDto);

      expect(mockBenefitsService.create).toHaveBeenCalledWith(createBenefitDto);
      expect(result).toEqual(mockBenefit);
    });

    it('deve criar benefício com dados completos', async () => {
      const createBenefitDto: CreateBenefitDto = {
        name: 'Vale Cultura',
        description: 'Benefício cultural para funcionários',
      };
      const newBenefit = { ...mockBenefit, id: 3, ...createBenefitDto };
      mockBenefitsService.create.mockResolvedValue(newBenefit);

      const result = await controller.create(createBenefitDto);

      expect(mockBenefitsService.create).toHaveBeenCalledWith(createBenefitDto);
      expect(result).toEqual(newBenefit);
    });
  });

  describe('update', () => {
    it('deve atualizar um benefício', async () => {
      const updateData = { name: 'Nome Atualizado' };
      const updatedBenefit = { ...mockBenefit, ...updateData };
      mockBenefitsService.update.mockResolvedValue(updatedBenefit);

      const result = await controller.update('1', updateData);

      expect(mockBenefitsService.update).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedBenefit);
    });

    it('deve atualizar benefício com dados parciais', async () => {
      const updateData = { description: 'Nova descrição' };
      const updatedBenefit = { ...mockBenefit, ...updateData };
      mockBenefitsService.update.mockResolvedValue(updatedBenefit);

      const result = await controller.update('1', updateData);

      expect(mockBenefitsService.update).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedBenefit);
    });

    it('deve converter string ID para número na atualização', async () => {
      const updateData = { name: 'Nome Atualizado' };
      const updatedBenefit = { ...mockBenefit, ...updateData };
      mockBenefitsService.update.mockResolvedValue(updatedBenefit);

      const result = await controller.update('456', updateData);

      expect(mockBenefitsService.update).toHaveBeenCalledWith(456, updateData);
      expect(result).toEqual(updatedBenefit);
    });
  });

  describe('deactivate', () => {
    it('deve desativar um benefício', async () => {
      const deactivatedBenefit = { ...mockBenefit, isActive: false };
      mockBenefitsService.deactivate.mockResolvedValue(deactivatedBenefit);

      const result = await controller.deactivate('1');

      expect(mockBenefitsService.deactivate).toHaveBeenCalledWith(1);
      expect(result).toEqual(deactivatedBenefit);
    });

    it('deve converter string ID para número na desativação', async () => {
      const deactivatedBenefit = { ...mockBenefit, isActive: false };
      mockBenefitsService.deactivate.mockResolvedValue(deactivatedBenefit);

      const result = await controller.deactivate('789');

      expect(mockBenefitsService.deactivate).toHaveBeenCalledWith(789);
      expect(result).toEqual(deactivatedBenefit);
    });
  });

  describe('activate', () => {
    it('deve ativar um benefício', async () => {
      const activatedBenefit = { ...mockBenefit, isActive: true };
      mockBenefitsService.activate.mockResolvedValue(activatedBenefit);

      const result = await controller.activate('1');

      expect(mockBenefitsService.activate).toHaveBeenCalledWith(1);
      expect(result).toEqual(activatedBenefit);
    });

    it('deve converter string ID para número na ativação', async () => {
      const activatedBenefit = { ...mockBenefit, isActive: true };
      mockBenefitsService.activate.mockResolvedValue(activatedBenefit);

      const result = await controller.activate('321');

      expect(mockBenefitsService.activate).toHaveBeenCalledWith(321);
      expect(result).toEqual(activatedBenefit);
    });
  });

  describe('remove', () => {
    it('deve remover um benefício', async () => {
      mockBenefitsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(mockBenefitsService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });

    it('deve converter string ID para número na remoção', async () => {
      mockBenefitsService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('654');

      expect(mockBenefitsService.remove).toHaveBeenCalledWith(654);
      expect(result).toBeUndefined();
    });
  });
});
