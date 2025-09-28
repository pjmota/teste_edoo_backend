import findAllBenefits from './list-all-benefits.service';

// Mock do modelo Benefit
const mockBenefitModel = {
  findAll: jest.fn(),
} as any;

describe('findAllBenefits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBenefits = [
    {
      id: 1,
      name: 'Vale Refeição',
      description: 'Benefício de alimentação',
      isActive: true,
    },
    {
      id: 2,
      name: 'Vale Transporte',
      description: 'Benefício de transporte',
      isActive: true,
    },
    {
      id: 3,
      name: 'Plano de Saúde',
      description: 'Benefício de saúde',
      isActive: false,
    },
    {
      id: 4,
      name: 'Seguro de Vida',
      description: 'Benefício de seguro',
      isActive: true,
    },
    {
      id: 5,
      name: 'Vale Cultura',
      description: 'Benefício cultural',
      isActive: true,
    },
  ];

  describe('sem paginação', () => {
    it('deve retornar todos os benefícios quando não há paginação', async () => {
      mockBenefitModel.findAll.mockResolvedValue(mockBenefits);

      const result = await findAllBenefits(mockBenefitModel);

      expect(mockBenefitModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: mockBenefits,
        total: 5,
      });
    });

    it('deve retornar array vazio quando não há benefícios', async () => {
      mockBenefitModel.findAll.mockResolvedValue([]);

      const result = await findAllBenefits(mockBenefitModel);

      expect(mockBenefitModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: [],
        total: 0,
      });
    });

    it('deve retornar todos os benefícios quando page é undefined', async () => {
      mockBenefitModel.findAll.mockResolvedValue(mockBenefits);

      const result = await findAllBenefits(mockBenefitModel, undefined, 2);

      expect(result).toEqual({
        data: mockBenefits,
        total: 5,
      });
    });

    it('deve retornar todos os benefícios quando limit é undefined', async () => {
      mockBenefitModel.findAll.mockResolvedValue(mockBenefits);

      const result = await findAllBenefits(mockBenefitModel, 1);

      expect(result).toEqual({
        data: mockBenefits,
        total: 5,
      });
    });
  });

  describe('com paginação', () => {
    it('deve retornar primeira página com 2 itens', async () => {
      mockBenefitModel.findAll.mockResolvedValue(mockBenefits);

      const result = await findAllBenefits(mockBenefitModel, 1, 2);

      expect(mockBenefitModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: mockBenefits.slice(0, 2),
        total: 5,
        page: 1,
        limit: 2,
      });
    });

    it('deve retornar segunda página com 2 itens', async () => {
      mockBenefitModel.findAll.mockResolvedValue(mockBenefits);

      const result = await findAllBenefits(mockBenefitModel, 2, 2);

      expect(mockBenefitModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: mockBenefits.slice(2, 4),
        total: 5,
        page: 2,
        limit: 2,
      });
    });

    it('deve retornar terceira página com 1 item restante', async () => {
      mockBenefitModel.findAll.mockResolvedValue(mockBenefits);

      const result = await findAllBenefits(mockBenefitModel, 3, 2);

      expect(mockBenefitModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: mockBenefits.slice(4, 6),
        total: 5,
        page: 3,
        limit: 2,
      });
    });

    it('deve retornar página vazia quando page está além dos dados', async () => {
      mockBenefitModel.findAll.mockResolvedValue(mockBenefits);

      const result = await findAllBenefits(mockBenefitModel, 10, 2);

      expect(mockBenefitModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: [],
        total: 5,
        page: 10,
        limit: 2,
      });
    });

    it('deve funcionar com limit maior que total de itens', async () => {
      mockBenefitModel.findAll.mockResolvedValue(mockBenefits);

      const result = await findAllBenefits(mockBenefitModel, 1, 10);

      expect(mockBenefitModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: mockBenefits,
        total: 5,
        page: 1,
        limit: 10,
      });
    });

    it('deve funcionar com paginação quando não há dados', async () => {
      mockBenefitModel.findAll.mockResolvedValue([]);

      const result = await findAllBenefits(mockBenefitModel, 1, 2);

      expect(mockBenefitModel.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 2,
      });
    });
  });

  describe('tratamento de erros', () => {
    it('deve propagar erro quando findAll falha', async () => {
      const errorMessage = 'Database connection failed';
      mockBenefitModel.findAll.mockRejectedValue(new Error(errorMessage));

      await expect(findAllBenefits(mockBenefitModel)).rejects.toThrow(
        errorMessage,
      );
      expect(mockBenefitModel.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
