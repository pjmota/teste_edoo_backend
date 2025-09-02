import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BenefitsService } from '../services/benefits.service';
import Benefit from 'src/models/benefits/benefits';
import { CreateBenefitDto } from '../DTOs/create-benefit.dto';
import { CreationAttributes } from 'sequelize';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('benefits')
@Controller('benefits')
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todos os benefícios com paginação opcional' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de itens por página', example: 10 })
  @ApiResponse({ status: 200, description: 'Lista de benefícios retornada com sucesso' })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: Benefit[]; total: number; page?: number; limit?: number }> {
    const pageNumber = page ? parseInt(page) : undefined;
    const limitNumber = limit ? parseInt(limit) : undefined;
    return this.benefitsService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um benefício pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do benefício', example: 1 })
  @ApiResponse({ status: 200, description: 'Benefício encontrado com sucesso' })
  findOne(@Param('id') id: string): Promise<Benefit> {
    return this.benefitsService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo benefício' })
  @ApiResponse({ status: 201, description: 'Benefício criado com sucesso' })
  create(@Body() benefitData: CreateBenefitDto): Promise<Benefit> {
    return this.benefitsService.create(benefitData as CreationAttributes<Benefit>);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um benefício pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do benefício', example: 1 })
  @ApiResponse({ status: 200, description: 'Benefício atualizado com sucesso' })
  update(@Param('id') id: string, @Body() benefitData: Partial<CreationAttributes<Benefit>>): Promise<Benefit> {
    return this.benefitsService.update(+id, benefitData);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Desativa um benefício pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do benefício', example: 1 })
  @ApiResponse({ status: 200, description: 'Benefício desativado com sucesso' })
  deactivate(@Param('id') id: string): Promise<Benefit> {
    return this.benefitsService.deactivate(+id);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Ativa um benefício pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do benefício', example: 1 })
  @ApiResponse({ status: 200, description: 'Benefício ativado com sucesso' })
  activate(@Param('id') id: string): Promise<Benefit> {
    return this.benefitsService.activate(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um benefício pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do benefício', example: 1 })
  @ApiResponse({ status: 200, description: 'Benefício removido com sucesso' })
  remove(@Param('id') id: string): Promise<void> {
    return this.benefitsService.remove(+id);
  }
}
