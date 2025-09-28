import { NotFoundException } from '@nestjs/common';
import Benefit from 'src/models/benefits/benefits';

const findOneBenefit = async (
  benefitModel: typeof Benefit,
  id: number,
): Promise<Benefit> => {
  const benefit = await benefitModel.findByPk(id);
  if (!benefit) {
    throw new NotFoundException(`Benefício com ID ${id} não encontrado`);
  }
  return benefit;
};

export default findOneBenefit;
