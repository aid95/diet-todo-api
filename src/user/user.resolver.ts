import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserInput } from './dtos/user-input.dto';
import { LoginOutput } from './dtos/login-output.dto';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => LoginOutput)
  login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    return this.userService.login(username, password);
  }

  @Mutation(() => User)
  CreateUser(@Args('userInput', { nullable: true }) userInput: UserInput) {
    return this.userService.create(userInput);
  }
}
