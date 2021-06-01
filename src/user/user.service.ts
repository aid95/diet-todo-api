import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { isExistsQuery } from '../common/utils/query';
import { UserInput } from './dtos/user-input.dto';
import { JwtService } from '../jwt/jwt.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  findOne(id: number) {
    return this.userRepository.findOneOrFail(id);
  }

  async login(username: string, password: string): Promise<string> {
    const user = await this.userRepository.findOneOrFail({ username });
    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      throw new UnauthorizedException();
    }
    return this.jwtService.sign({ id: user.id });
  }

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
