import {
  GoneException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JWT_CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './interfaces/jwt-module-options.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_CONFIG_OPTIONS)
    private readonly jwtModuleOptions: JwtModuleOptions,
  ) {}

  sign(payload: any): string {
    return jwt.sign(payload, this.jwtModuleOptions.accessTokenPrivateKey, {
      expiresIn: '1h',
    });
  }

  private static verify(token: string, secretKey: string): string {
    try {
      return jwt.verify(token, secretKey) as string;
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

  accessTokenVerify(token: string): string {
    return JwtService.verify(
      token,
      this.jwtModuleOptions.accessTokenPrivateKey,
    );
  }

  refreshTokenVerify(token: string): string {
    return JwtService.verify(
      token,
      this.jwtModuleOptions.refreshTokenPrivateKey,
    );
  }
}
