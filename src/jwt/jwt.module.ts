import { Global, Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { ConfigModule } from '@nestjs/config';
import { JwtResolver } from './jwt.resolver';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [JwtService, JwtResolver],
  exports: [JwtService],
})
export class JwtModule {}
