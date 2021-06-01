import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        ACCESS_TOKEN_PRIVATE_KEY: Joi.string().required(),
        REFRESH_TOKEN_PRIVATE_KEY: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: ['dist/**/entities/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    GraphQLModule.forRoot({
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      context: ({ req }) => {
        const { authorization } = req.headers;
        return {
          authorization,
        };
      },
      autoSchemaFile: true,
      playground: true,
    }),
    JwtModule.forRoot({
      accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
      refreshTokenPrivateKey: process.env.REFRESH_TOKEN_PRIVATE_KEY,
    }),
    AuthModule,
    UserModule,
    TodoModule,
  ],
})
export class AppModule {}
