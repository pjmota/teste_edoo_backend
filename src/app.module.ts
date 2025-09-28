import { Module } from '@nestjs/common';
import { BenefitsModule } from './models/benefits.module';
import { AppController } from './app.controller';

@Module({
  imports: [BenefitsModule],
  controllers: [AppController],
})
export class AppModule {}
