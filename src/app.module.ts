import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      autoSchemaFile: true,
      playground: true,
    }),
    TodoModule,
  ],
})
export class AppModule {}
