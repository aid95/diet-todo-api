import { Query, Resolver } from '@nestjs/graphql';
import { GetRefreshToken } from './decorators/refresh-token.decorator';
import { JwtService } from './jwt.service';

@Resolver()
export class JwtResolver {
  constructor(private readonly jwtService: JwtService) {}
  @Query(() => String)
  renewToken(@GetRefreshToken() refreshToken: string) {
    return this.jwtService.renewAccessToken(refreshToken);
  }
}
