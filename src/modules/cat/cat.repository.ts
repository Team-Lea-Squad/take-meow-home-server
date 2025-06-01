import { Repository } from 'typeorm';
import { Cat } from './cat.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class CatRepository {
  constructor(
    @InjectRepository(Cat)
    private readonly repository: Repository<Cat>,
  ) {}

  async findAll(): Promise<Cat[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Cat | null> {
    return this.repository.findOne({ where: { id } });
  }

  async create(catData: Partial<Cat>, owner: User): Promise<Cat> {
    const cat = this.repository.create({
      ...catData,
      owner,
    });
    return this.repository.save(cat);
  }

  async update(id: number, catData: Partial<Cat>): Promise<Cat | null> {
    await this.repository.update(id, catData);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async findByOwner(ownerId: number): Promise<Cat[]> {
    return this.repository.find({
      where: { owner: { id: ownerId } },
    });
  }
} 