import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatController } from './cat.controller';
import { CatService } from './cat.service';
import { CatRepository } from './cat.repository';
import { Cat } from './cat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cat])],
  controllers: [CatController],
  providers: [CatService, CatRepository],
})
export class CatModule {} 