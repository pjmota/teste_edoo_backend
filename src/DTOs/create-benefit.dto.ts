import { IsString, Length, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBenefitDto {
  @ApiProperty({
    description: 'Nome do benefício',
    example: 'Vale Refeição',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @Length(3, 100, { message: 'O campo name deve ter entre 3 e 100 caracteres' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do benefício',
    example: 'Benefício para alimentação',
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @Length(0, 255, {
    message: 'O campo description deve ter no máximo 255 caracteres',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Indica se o benefício está ativo',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
