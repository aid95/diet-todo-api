import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isExistsQuery } from 'src/common/utils/query';
import { Repository } from 'typeorm';
import { TodoInput } from './dtos/todo-input.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}
  create({ name, completed }: TodoInput): Promise<Todo> {
    const completedAt = completed ? new Date() : null;
    const newTodo = this.todoRepository.create({
      name,
      completed,
      completedAt,
    });
    return this.todoRepository.save(newTodo);
  }

  findOneById(id: number): Promise<Todo> {
    return this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.user', 'user')
      .where('todo.id = :todoId', { todoId: id })
      .getOne();
  }

  findAll(): Promise<Todo[]> {
    return this.todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.user', 'user')
      .getMany();
  }

  async update(id: number, { name, completed }: TodoInput): Promise<Todo> {
    const exists = await this.isExists(id);
    if (!exists) {
      throw new NotFoundException();
    }

    const completedAt = completed ? new Date() : null;
    return this.todoRepository.save({ id, name, completed, completedAt });
  }

  async remove(id: number): Promise<Todo> {
    const exists = await this.isExists(id);
    if (!exists) {
      throw new NotFoundException();
    }

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

  private async isExists(id: number): Promise<boolean> {
    const query = this.todoRepository
      .createQueryBuilder('todo')
      .select('1')
      .where(`todo.id = ${id}`)
      .getQuery();
    const [{ exists }] = await this.todoRepository.query(isExistsQuery(query));
    return exists as boolean;
  }
}
