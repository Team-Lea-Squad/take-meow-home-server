import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CatService } from './cat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('cats')
export class CatController {
  constructor(private readonly catService: CatService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.catService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.catService.findOne(id);
  }
} 