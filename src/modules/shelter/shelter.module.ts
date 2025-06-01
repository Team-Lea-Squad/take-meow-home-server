import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShelterController } from './shelter.controller';
import { ShelterService } from './shelter.service';
import { ShelterRepository } from './shelter.repository';
import { Shelter } from './shelter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shelter])],
  controllers: [ShelterController],
  providers: [ShelterService, ShelterRepository],
  exports: [ShelterService],
})
export class ShelterModule {} 