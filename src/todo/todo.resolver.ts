import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoInput } from './dtos/todo-input.dto';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';
import { GetAuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '../user/entities/user.entity';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => Todo, { nullable: true })
  todo(@Args('todoId', { nullable: true }) todoId: number): Promise<Todo> {
    return this.todoService.findOneById(todoId);
  }

  @Query(() => [Todo])
  todos(): Promise<Todo[]> {
    return this.todoService.findAll();
  }

  @Mutation(() => Todo, { nullable: true })
  CreateTodo(
    @GetAuthUser() authUser: User,
    @Args('todoInput', { nullable: true }) todoInput: TodoInput,
  ): Promise<Todo> {
    return this.todoService.create(authUser, todoInput);
  }

  @Mutation(() => Todo, { nullable: true })
  UpdateTodo(
    @GetAuthUser() authUser: User,
    @Args('todoId', { nullable: true }) todoId: number,
    @Args('todoInput', { nullable: true }) todoInput: TodoInput,
  ): Promise<Todo> {
    return this.todoService.update(authUser, todoId, todoInput);
  }

  @Mutation(() => Todo, { nullable: true })
  DeleteTodo(
    @GetAuthUser() authUser: User,
    @Args('todoId', { nullable: true }) todoId: number,
  ): Promise<Todo> {
    return this.todoService.remove(authUser, todoId);
  }
}
