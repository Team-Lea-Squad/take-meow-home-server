import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Shelter } from '../shelter/shelter.entity';

@Entity()
export class Cat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @ManyToOne(() => User, { eager: true })
  owner: User;

  @ManyToOne(() => Shelter, shelter => shelter.cats, { nullable: true })
  shelter: Shelter;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 