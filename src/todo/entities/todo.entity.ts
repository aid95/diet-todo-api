import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class Todo extends CommonEntity {
  @Field(() => String)
  @Column()
  name: string;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true, default: false })
  completed?: boolean;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  completedAt?: Date;
}
