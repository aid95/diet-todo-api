import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommonEntity {
  @Field(() => Number)
  id: number;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
