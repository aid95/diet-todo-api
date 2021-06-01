import {
  GoneException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AccessToken, RefreshToken } from './interfaces/token.interface';
import { ConfigService } from '@nestjs/config';
import {
  ACCESS_TOKEN_EXPIRATION_TIME,
  ACCESS_TOKEN_PRIVATE_KEY,
  INVALID_TOKEN,
  JWT_EXPIRED,
  JWT_MALFORMED,
  REFRESH_TOKEN_EXPIRATION_TIME,
  REFRESH_TOKEN_PRIVATE_KEY,
} from './jwt.constants';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  private static sign(
    payload: AccessToken | RefreshToken,
    secret: string,
    expiresIn: string | number,
  ): string {
    return jwt.sign(payload, secret, {
      expiresIn,
    });
  }

  getAccessToken(payload: AccessToken) {
    return JwtService.sign(
      payload,
      this.configService.get<string>(ACCESS_TOKEN_PRIVATE_KEY),
      this.configService.get<string>(ACCESS_TOKEN_EXPIRATION_TIME),
    );
  }

  getRefreshToken(payload: RefreshToken) {
    return JwtService.sign(
      payload,
      this.configService.get<string>(REFRESH_TOKEN_PRIVATE_KEY),
      this.configService.get<string>(REFRESH_TOKEN_EXPIRATION_TIME),
    );
  }

  private static verify(token: string, secretKey: string) {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      switch (error.message) {
        case JWT_MALFORMED:
        case INVALID_TOKEN:
          throw new UnauthorizedException();
        case JWT_EXPIRED:
          throw new GoneException();
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  accessTokenVerify(token: string): AccessToken {
    return JwtService.verify(
      token,
      this.configService.get<string>(ACCESS_TOKEN_PRIVATE_KEY),
    ) as AccessToken;
  }

  refreshTokenVerify(token: string): RefreshToken {
    return JwtService.verify(
      token,
      this.configService.get<string>(REFRESH_TOKEN_PRIVATE_KEY),
    ) as RefreshToken;
  }

  renewAccessToken(refreshToken: string) {
    const decodedRefreshToken = this.refreshTokenVerify(refreshToken);
    return this.getAccessToken({ id: decodedRefreshToken.id });
  }
}
