import { Field, ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Todo } from 'src/todo/entities/todo.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class User extends CommonEntity {
  @Field(() => String, { description: "The user's full name" })
  @Column()
  name: string;

  @Field(() => Number)
  @Column()
  age: number;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
