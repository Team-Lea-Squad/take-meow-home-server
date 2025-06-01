import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shelter } from './shelter.entity';

@Injectable()
export class ShelterRepository {
  constructor(
    @InjectRepository(Shelter)
    private readonly repository: Repository<Shelter>,
  ) {}

  async findAll(): Promise<Shelter[]> {
    return this.repository.find({
      relations: ['cats'],
    });
  }

  async findById(id: number): Promise<Shelter | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['cats'],
    });
  }

  async create(shelterData: Partial<Shelter>): Promise<Shelter> {
    const shelter = this.repository.create(shelterData);
    return this.repository.save(shelter);
  }

  async update(id: number, shelterData: Partial<Shelter>): Promise<Shelter | null> {
    await this.repository.update(id, shelterData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByName(name: string): Promise<Shelter[]> {
    return this.repository.find({
      where: { name },
      relations: ['cats'],
    });
  }

  async findActive(): Promise<Shelter[]> {
    return this.repository.find({
      where: { isActive: true },
      relations: ['cats'],
    });
  }
} 