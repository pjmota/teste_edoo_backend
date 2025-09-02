import { CreationAttributes } from 'sequelize';
import Benefit from 'src/models/benefits/benefits';
import findOneBenefit from './ListOneBenefit.service';

const updateBenefit = async (
  benefitModel: typeof Benefit,
  id: number,
  benefitData: Partial<CreationAttributes<Benefit>>,
): Promise<Benefit> => {
  const benefit = await findOneBenefit(benefitModel, id);
  return benefit.update(benefitData);
};

export default updateBenefit;