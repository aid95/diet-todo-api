import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from '../../user/user.service';
import { JwtService } from '../../jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    return this.validateRequest(gqlContext);
  }

  private async validateRequest(request) {
    const { authorization } = request;
    if (authorization) {
      const [bearer, token] = authorization.split(' ');
      if (bearer === 'Bearer' && token !== undefined) {
        const decoded = this.jwtService.accessTokenVerify(token);
        request['authUser'] = await this.userService.findOne(decoded.id);
      }
    }
    return true;
  }
}
