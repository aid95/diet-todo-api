import { Field, InputType } from '@nestjs/graphql';

@InputType('TodoInput')
export class TodoInput {
  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  completed: boolean;
}
