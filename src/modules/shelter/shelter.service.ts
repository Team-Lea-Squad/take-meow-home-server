import { Injectable, NotFoundException } from '@nestjs/common';
import { Shelter } from './shelter.entity';
import { ShelterRepository } from './shelter.repository';

@Injectable()
export class ShelterService {
  constructor(
    private readonly shelterRepository: ShelterRepository,
  ) {}

  async findAll(): Promise<Shelter[]> {
    return this.shelterRepository.findAll();
  }

  async findOne(id: number): Promise<Shelter> {
    const shelter = await this.shelterRepository.findById(id);
    if (!shelter) {
      throw new NotFoundException(`Shelter with ID "${id}" not found`);
    }
    return shelter;
  }

  async create(shelterData: Partial<Shelter>): Promise<Shelter> {
    return this.shelterRepository.create(shelterData);
  }

  async update(id: number, shelterData: Partial<Shelter>): Promise<Shelter> {
    const shelter = await this.shelterRepository.update(id, shelterData);
    if (!shelter) {
      throw new NotFoundException(`Shelter with ID "${id}" not found`);
    }
    return shelter;
  }

  async delete(id: number): Promise<void> {
    const shelter = await this.shelterRepository.findById(id);
    if (!shelter) {
      throw new NotFoundException(`Shelter with ID "${id}" not found`);
    }
    await this.shelterRepository.delete(id);
  }

  async findByName(name: string): Promise<Shelter[]> {
    return this.shelterRepository.findByName(name);
  }

  async findActive(): Promise<Shelter[]> {
    return this.shelterRepository.findActive();
  }
} 