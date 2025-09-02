import { Module } from '@nestjs/common';
import { BenefitsModule } from './models/benefits.module';

@Module({
  imports: [BenefitsModule],
})
export class AppModule {}
