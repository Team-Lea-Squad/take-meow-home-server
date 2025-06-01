import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email "${email}" not found`);
    }
    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    return this.userRepository.create(userData);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(id, userData);
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
} 