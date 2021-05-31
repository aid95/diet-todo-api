import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoInput } from './dtos/todo-input.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}
  create({ name, completed }: TodoInput): Promise<Todo> {
    const newTodo = this.todoRepository.create({ name, completed });
    return this.todoRepository.save(newTodo);
  }

  findOneById(id: number): Promise<Todo> {
    return this.todoRepository.findOneOrFail({ id });
  }

  findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  update(id: number, { name, completed }: TodoInput): Promise<Todo> {
    return this.todoRepository.save({ id, name, completed });
  }

  async remove(id: number): Promise<Todo> {
    const {
      raw: [deletedTodo],
    } = await this.todoRepository
      .createQueryBuilder()
      .delete()
      .where({ id })
      .returning('*')
      .execute();
    return deletedTodo as Todo;
  }
}
