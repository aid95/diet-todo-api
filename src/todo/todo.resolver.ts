import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { TodoInput } from './dtos/todo-input.dto';
import { Todo } from './entities/todo.entity';
import { TodoService } from './todo.service';

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
    @Args('todoInput', { nullable: true }) todoInput: TodoInput,
  ): Promise<Todo> {
    return this.todoService.create(todoInput);
  }

  @Mutation(() => Todo, { nullable: true })
  UpdateTodo(
    @Args('todoId', { nullable: true }) todoId: number,
    @Args('todoInput', { nullable: true }) todoInput: TodoInput,
  ): Promise<Todo> {
    return this.todoService.update(todoId, todoInput);
  }

  @Mutation(() => Todo, { nullable: true })
  DeleteTodo(
    @Args('todoId', { nullable: true }) todoId: number,
  ): Promise<Todo> {
    return this.todoService.remove(todoId);
  }
}
