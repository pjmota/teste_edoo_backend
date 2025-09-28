import { BadRequestException } from '@nestjs/common';
import createBenefit from './create-benefit.service';
import { BenefitCreationAttrs } from '../../types/benefits.types';

// Mock do modelo Benefit
const mockBenefitModel = {
  findOne: jest.fn(),
  create: jest.fn(),
} as any;

describe('createBenefit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const benefitData: BenefitCreationAttrs = {
    name: 'Vale Refeição',
    description: 'Benefício de alimentação',
  };

  const createdBenefit = {
    id: 1,
    name: 'Vale Refeição',
    description: 'Benefício de alimentação',
    isActive: true,
  };

  describe('criação bem-sucedida', () => {
    it('deve criar um benefício quando não existe nome duplicado', async () => {
      mockBenefitModel.findOne.mockResolvedValue(null);
      mockBenefitModel.create.mockResolvedValue(createdBenefit);

      const result = await createBenefit(mockBenefitModel, benefitData);

      expect(mockBenefitModel.findOne).toHaveBeenCalledWith({
        where: { name: benefitData.name },
      });
      expect(mockBenefitModel.create).toHaveBeenCalledWith(benefitData);
      expect(result).toEqual(createdBenefit);
    });

    it('deve criar benefício com nome diferente', async () => {
      const differentBenefitData = {
        name: 'Vale Transporte',
        description: 'Benefício de transporte',
      };

      const differentCreatedBenefit = {
        id: 2,
        name: 'Vale Transporte',
        description: 'Benefício de transporte',
        isActive: true,
      };

      mockBenefitModel.findOne.mockResolvedValue(null);
      mockBenefitModel.create.mockResolvedValue(differentCreatedBenefit);

      const result = await createBenefit(
        mockBenefitModel,
        differentBenefitData,
      );

      expect(mockBenefitModel.findOne).toHaveBeenCalledWith({
        where: { name: differentBenefitData.name },
      });
      expect(mockBenefitModel.create).toHaveBeenCalledWith(
        differentBenefitData,
      );
      expect(result).toEqual(differentCreatedBenefit);
    });
  });

  describe('validação de nome duplicado', () => {
    it('deve lançar BadRequestException quando já existe benefício com o mesmo nome', async () => {
      const existingBenefit = {
        id: 1,
        name: 'Vale Refeição',
        description: 'Benefício existente',
        isActive: true,
      };

      mockBenefitModel.findOne.mockResolvedValue(existingBenefit);

      await expect(
        createBenefit(mockBenefitModel, benefitData),
      ).rejects.toThrow(BadRequestException);
      await expect(
        createBenefit(mockBenefitModel, benefitData),
      ).rejects.toThrow('Já existe um benefício com o nome "Vale Refeição"');

      expect(mockBenefitModel.findOne).toHaveBeenCalledWith({
        where: { name: benefitData.name },
      });
      expect(mockBenefitModel.create).not.toHaveBeenCalled();
    });

    it('deve lançar BadRequestException com nome específico na mensagem', async () => {
      const duplicateBenefitData = {
        name: 'Plano de Saúde',
        description: 'Benefício de saúde',
      };
      const existingBenefit = {
        id: 2,
        name: 'Plano de Saúde',
        description: 'Benefício existente',
        isActive: false,
      };

      mockBenefitModel.findOne.mockResolvedValue(existingBenefit);

      await expect(
        createBenefit(mockBenefitModel, duplicateBenefitData),
      ).rejects.toThrow('Já existe um benefício com o nome "Plano de Saúde"');

      expect(mockBenefitModel.findOne).toHaveBeenCalledWith({
        where: { name: duplicateBenefitData.name },
      });
      expect(mockBenefitModel.create).not.toHaveBeenCalled();
    });

    it('deve verificar nome case-sensitive', async () => {
      const caseSensitiveBenefitData = {
        name: 'vale refeição', // nome em minúsculo
        description: 'Benefício de alimentação',
      };

      mockBenefitModel.findOne.mockResolvedValue(null); // não encontra porque é case-sensitive
      mockBenefitModel.create.mockResolvedValue({
        id: 3,
        name: 'vale refeição',
        description: 'Benefício de alimentação',
        isActive: true,
      });

      const result = await createBenefit(
        mockBenefitModel,
        caseSensitiveBenefitData,
      );

      expect(mockBenefitModel.findOne).toHaveBeenCalledWith({
        where: { name: caseSensitiveBenefitData.name },
      });
      expect(mockBenefitModel.create).toHaveBeenCalledWith(
        caseSensitiveBenefitData,
      );
      expect(result.name).toBe('vale refeição');
    });
  });

  describe('tratamento de erros', () => {
    it('deve propagar erro quando findOne falha', async () => {
      const errorMessage = 'Database connection failed';
      mockBenefitModel.findOne.mockRejectedValue(new Error(errorMessage));

      await expect(
        createBenefit(mockBenefitModel, benefitData),
      ).rejects.toThrow(errorMessage);
      expect(mockBenefitModel.findOne).toHaveBeenCalledWith({
        where: { name: benefitData.name },
      });
      expect(mockBenefitModel.create).not.toHaveBeenCalled();
    });

    it('deve propagar erro quando create falha', async () => {
      const errorMessage = 'Failed to create benefit';
      mockBenefitModel.findOne.mockResolvedValue(null);
      mockBenefitModel.create.mockRejectedValue(new Error(errorMessage));

      await expect(
        createBenefit(mockBenefitModel, benefitData),
      ).rejects.toThrow(errorMessage);
      expect(mockBenefitModel.findOne).toHaveBeenCalledWith({
        where: { name: benefitData.name },
      });
      expect(mockBenefitModel.create).toHaveBeenCalledWith(benefitData);
    });
  });
});
