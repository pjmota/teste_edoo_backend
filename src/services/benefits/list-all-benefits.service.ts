import Benefit from 'src/models/benefits/benefits';

const findAllBenefits = async (
  benefitModel: typeof Benefit,
  page?: number,
  limit?: number,
) => {
  const allData = await benefitModel.findAll();
  const total = allData.length;

  if (page && limit) {
    const offset = (page - 1) * limit;
    const data = allData.slice(offset, offset + limit); // aplica paginação manual
    return { data, total, page, limit };
  }

  return { data: allData, total };
};

export default findAllBenefits;
