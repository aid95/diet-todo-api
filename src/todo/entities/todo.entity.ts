import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';

@ObjectType()
export class Todo extends CommonEntity {
  @Field(() => String)
  name: string;

  @Field(() => Boolean, { nullable: true })
  completed?: boolean;

  @Field(() => Date, { nullable: true })
  completedAt?: Date;
}
