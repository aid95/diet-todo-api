import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { isExistsQuery } from '../common/utils/query';
import { UserInput } from './dtos/user-input.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(userInput: UserInput): Promise<User> {
    const exists = await this.isExists(userInput.username);
    if (exists) {
      throw new UnprocessableEntityException();
    }

    try {
      const newUser = this.userRepository.create(userInput);
      return this.userRepository.save(newUser);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  private async isExists(username: string): Promise<boolean> {
    try {
      const query = this.userRepository
        .createQueryBuilder('user')
        .select('1')
        .where(`user.username = '${username}'`)
        .getQuery();
      const [{ exists }] = await this.userRepository.query(
        isExistsQuery(query),
      );
      return exists as boolean;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
