import { Injectable, NotFoundException } from '@nestjs/common';
import { Cat } from './cat.entity';
import { CatRepository } from './cat.repository';
import { User } from '../user/user.entity';

@Injectable()
export class CatService {
  constructor(
    private readonly catRepository: CatRepository,
  ) {}

  async findAll(): Promise<Cat[]> {
    return this.catRepository.findAll();
  }

  async findOne(id: number): Promise<Cat> {
    const cat = await this.catRepository.findById(id);
    if (!cat) {
      throw new NotFoundException(`Cat with ID "${id}" not found`);
    }
    return cat;
  }

  async create(catData: Partial<Cat>, owner: User): Promise<Cat> {
    return this.catRepository.create(catData, owner);
  }

  async update(id: number, catData: Partial<Cat>): Promise<Cat> {
    const cat = await this.catRepository.update(id, catData);
    if (!cat) {
      throw new NotFoundException(`Cat with ID "${id}" not found`);
    }
    return cat;
  }

  async delete(id: number): Promise<void> {
    await this.catRepository.delete(id);
  }

  async findByOwner(ownerId: number): Promise<Cat[]> {
    return this.catRepository.findByOwner(ownerId);
  }
} 