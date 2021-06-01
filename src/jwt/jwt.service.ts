import {
  GoneException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Token } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  sign(payload: Token): string {
    return jwt.sign(
      payload,
      this.configService.get<string>('ACCESS_TOKEN_PRIVATE_KEY'),
      {
        expiresIn: '1h',
      },
    );
  }

  private static verify(token: string, secretKey: string): Token {
    try {
      return jwt.verify(token, secretKey) as Token;
    } catch (error) {
      switch (error.message) {
        case 'jwt malformed':
        case 'invalid token':
          throw new UnauthorizedException();
        case 'jwt expired':
          throw new GoneException();
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  accessTokenVerify(token: string): Token {
    return JwtService.verify(
      token,
      this.configService.get<string>('ACCESS_TOKEN_PRIVATE_KEY'),
    );
  }

  refreshTokenVerify(token: string): Token {
    return JwtService.verify(
      token,
      this.configService.get<string>('REFRESH_TOKEN_PRIVATE_KEY'),
    );
  }
}
