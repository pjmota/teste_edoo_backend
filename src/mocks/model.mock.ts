export const mockBenefitModel = {
  findAll: jest.fn(),
  findAndCountAll: jest.fn(),
  create: jest.fn(),
  findByPk: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn().mockResolvedValue(1),
} as any;
