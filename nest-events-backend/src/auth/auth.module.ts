import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { LocalStrategy } from './local.strategy';
import { AuthController, JwtAuthGuard } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.AUTH_SECRET,
      signOptions: {
        expiresIn: '60m',
      },
    }),
  ],
  providers: [LocalStrategy, JwtAuthGuard, JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {

}