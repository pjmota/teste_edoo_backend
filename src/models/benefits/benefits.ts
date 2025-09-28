import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { BenefitCreationAttrs } from '../../types/benefits.types';

@Table({ paranoid: true })
class Benefit extends Model<Benefit, BenefitCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [3, 100],
    },
  })
  declare name: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    validate: {
      len: [0, 255],
    },
  })
  declare description?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isActive: boolean;

  @Column({
    type: DataType.DATE,
  })
  declare deletedAt?: Date;
}

export default Benefit;
