import Benefit from 'src/models/benefits/benefits';
import findOneBenefit from './list-one-benefit.service';

const removeBenefit = async (
  benefitModel: typeof Benefit,
  id: number,
): Promise<void> => {
  const benefit = await findOneBenefit(benefitModel, id);
  await benefit.destroy();
};

export default removeBenefit;
