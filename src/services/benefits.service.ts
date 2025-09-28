import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreationAttributes } from 'sequelize';
import Benefit from '../models/benefits/benefits';

import createBenefit from './benefits/create-benefit.service';
import findOneBenefit from './benefits/list-one-benefit.service';
import updateBenefit from './benefits/update-benefit.service';
import removeBenefit from './benefits/delete-benefit.service';
import activateBenefit from './benefits/activate-benefit.service';
import deactivateBenefit from './benefits/deactivate-benefit.service';
import { BenefitCreationAttrs } from '../types/benefits.types';

@Injectable()
export class BenefitsService {
  constructor(
    @InjectModel(Benefit)
    private readonly benefitModel: typeof Benefit,
  ) {}

  async create(benefitData: BenefitCreationAttrs): Promise<Benefit> {
    return createBenefit(this.benefitModel, benefitData);
  }

  async findAll(
    page?: number,
    limit?: number,
  ): Promise<{
    data: Benefit[];
    total: number;
    page?: number;
    limit?: number;
  }> {
    if (page && limit) {
      const offset = (page - 1) * limit;
      const { rows, count } = await this.benefitModel.findAndCountAll({
        limit,
        offset,
      });

      return {
        data: rows,
        total: count,
        page,
        limit,
      };
    }

    const data = await this.benefitModel.findAll();
    return {
      data,
      total: data.length,
    };
  }

  async findOne(id: number): Promise<Benefit> {
    return findOneBenefit(this.benefitModel, id);
  }

  async update(
    id: number,
    benefitData: Partial<CreationAttributes<Benefit>>,
  ): Promise<Benefit> {
    return updateBenefit(this.benefitModel, id, benefitData);
  }

  async remove(id: number): Promise<void> {
    return removeBenefit(this.benefitModel, id);
  }

  async activate(id: number): Promise<Benefit> {
    return activateBenefit(this.benefitModel, id);
  }

  async deactivate(id: number): Promise<Benefit> {
    return deactivateBenefit(this.benefitModel, id);
  }
}
