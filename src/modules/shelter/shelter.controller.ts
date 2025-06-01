import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ShelterService } from './shelter.service';
import { Shelter } from './shelter.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('shelters')
@UseGuards(JwtAuthGuard)
export class ShelterController {
  constructor(private readonly shelterService: ShelterService) {}

  @Get()
  async findAll(): Promise<Shelter[]> {
    return this.shelterService.findAll();
  }

  @Get('active')
  async findActive(): Promise<Shelter[]> {
    return this.shelterService.findActive();
  }

  @Get('search')
  async findByName(@Query('name') name: string): Promise<Shelter[]> {
    return this.shelterService.findByName(name);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Shelter> {
    return this.shelterService.findOne(id);
  }

  @Post()
  async create(@Body() shelterData: Partial<Shelter>): Promise<Shelter> {
    return this.shelterService.create(shelterData);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() shelterData: Partial<Shelter>,
  ): Promise<Shelter> {
    return this.shelterService.update(id, shelterData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.shelterService.delete(id);
  }
} 