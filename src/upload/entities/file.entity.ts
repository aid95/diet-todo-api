import { ObjectType } from '@nestjs/graphql';
import { CommonEntity } from 'src/common/entities/common.entity';
import { Column, Entity } from 'typeorm';

@ObjectType()
@Entity()
export class File extends CommonEntity {
  @Column()
  url: string;

  @Column()
  key: string;
}
