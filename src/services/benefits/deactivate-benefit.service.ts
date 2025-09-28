import Benefit from 'src/models/benefits/benefits';
import updateBenefit from './update-benefit.service';

const deactivateBenefit = async (
  benefitModel: typeof Benefit,
  id: number,
): Promise<Benefit> => {
  return updateBenefit(benefitModel, id, { isActive: false });
};

export default deactivateBenefit;
