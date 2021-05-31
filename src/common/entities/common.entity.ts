import { Field, ObjectType } from '@nestjs/graphql';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export class CommonEntity {
  @Field(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Date, { nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;
}
