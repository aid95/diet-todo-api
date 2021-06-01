import { Field, InputType, PickType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

@InputType()
export class UserInput extends PickType(User, ['name', 'age']) {
  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;
}
