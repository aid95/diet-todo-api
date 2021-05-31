import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
