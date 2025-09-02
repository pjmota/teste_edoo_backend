import Benefit from 'src/models/benefits/benefits';
import updateBenefit from './UpdateBenefit.service'

const activateBenefit = async (
  benefitModel: typeof Benefit,
  id: number,
): Promise<Benefit> => {
  return updateBenefit(benefitModel, id, { isActive: true });
};

export default activateBenefit;