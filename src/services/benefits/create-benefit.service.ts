import { BadRequestException } from '@nestjs/common';
import Benefit from '../../models/benefits/benefits';
import { BenefitCreationAttrs } from '../../types/benefits.types';

const createBenefit = async (
  benefitModel: typeof Benefit,
  benefitData: BenefitCreationAttrs,
): Promise<Benefit> => {
  const exists = await benefitModel.findOne({
    where: { name: benefitData.name },
  });

  if (exists) {
    throw new BadRequestException(
      `Já existe um benefício com o nome "${benefitData.name}"`,
    );
  }
  return benefitModel.create(benefitData);
};

export default createBenefit;
