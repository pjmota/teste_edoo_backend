import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BenefitsService } from 'src/services/benefits.service';
import { BenefitsController } from 'src/controllers/benefits.controller';
import Benefit from './benefits/benefits';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'sqlite',
        storage: configService.get<string>('DATABASE_STORAGE') || './data/benefits.db',
        models: [Benefit],
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
    SequelizeModule.forFeature([Benefit]),
  ],
  providers: [BenefitsService],
  controllers: [BenefitsController],
})

export class BenefitsModule {};