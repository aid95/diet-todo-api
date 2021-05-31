import { Injectable } from '@nestjs/common';
import { TodoInput } from './dtos/todo-input.dto';

@Injectable()
export class TodoService {
  create({ name, completed }: TodoInput) {}

  findOneById(id: number) {}

  findAll() {}

  update(id: number, { name, completed }: TodoInput) {}

  remove(id: number) {}
}
