import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { jwtStrategy } from './jwt.strategy';

@Module({
  imports:[
    PassportModule,
    JwtModule.registerAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
      secret: config.getOrThrow('JWT_SECRET'),
      signOptions: { expiresIn: '60s' },
    }), 
  })],
  controllers: [AuthController],
  providers: [AuthService, jwtStrategy],
  exports: [jwtStrategy]
})
export class AuthModule {}
