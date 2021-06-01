import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isExistsQuery } from 'src/common/utils/query';
import { Repository } from 'typeorm';
import { TodoInput } from './dtos/todo-input.dto';
import { Todo } from './entities/todo.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo) private readonly todoRepository: Repository<Todo>,
  ) {}

  create(author: User, { name, completed }: TodoInput): Promise<Todo> {
    if (!author) {
      throw new UnauthorizedException();
    }

    try {
      const completedAt = completed ? new Date() : null;
      const newTodo = this.todoRepository.create({
        name,
        completed,
        completedAt,
        user: author,
      });
      return this.todoRepository.save(newTodo);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findOneById(id: number): Promise<Todo> {
    try {
      return this.todoRepository
        .createQueryBuilder('todo')
        .leftJoinAndSelect('todo.user', 'user')
        .where('todo.id = :todoId', { todoId: id })
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  findAll(): Promise<Todo[]> {
    try {
      return this.todoRepository
        .createQueryBuilder('todo')
        .leftJoinAndSelect('todo.user', 'user')
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async update(
    author: User,
    id: number,
    { name, completed }: TodoInput,
  ): Promise<Todo> {
    if (!author) {
      throw new UnauthorizedException();
    }

    const exists = await this.isExists(id, author.id);
    if (!exists) {
      throw new NotFoundException();
    }

    try {
      const completedAt = completed ? new Date() : null;
      return this.todoRepository.save({ id, name, completed, completedAt });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(author: User, id: number): Promise<Todo> {
    if (!author) {
      throw new UnauthorizedException();
    }

    const exists = await this.isExists(id, author.id);
    if (!exists) {
      throw new NotFoundException();
    }

    try {
      const {
        raw: [deletedTodo],
      } = await this.todoRepository
        .createQueryBuilder()
        .delete()
        .where({ id })
        .andWhere('user = :userId', { userId: author.id })
        .returning('*')
        .execute();
      return deletedTodo as Todo;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  private async isExists(todoId: number, authorId: number): Promise<boolean> {
    try {
      const query = this.todoRepository
        .createQueryBuilder('todo')
        .select('1')
        .where(`todo.id = ${todoId}`)
        .andWhere(`todo.user = ${authorId}`)
        .getQuery();
      const [{ exists }] = await this.todoRepository.query(
        isExistsQuery(query),
      );
      return exists as boolean;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
