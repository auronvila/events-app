import { BadRequestException, Body, Controller, Get, Injectable, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import { CurrentUser } from './current-user.decorator';
import { CreateUserDto } from './input/create.user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
  }

  @Post('sign-in')
  @UseGuards(JwtAuthGuard)
  async signIn(@CurrentUser() user: UserEntity) {
    return {
      userId: user.Id,
      access_token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: UserEntity): Promise<UserEntity> {
    return user;
  }

  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = new UserEntity();

    if (createUserDto.password !== createUserDto.retypedPassword) {
      throw new BadRequestException(['Passwords are not identical']);
    }

    const findUserByEmail = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    const findUserByUserName = await this.userRepository.findOne({ where: { username: createUserDto.username } });
    if (findUserByEmail) {
      throw new BadRequestException(['The user with this email already exists']);
    }
    if (findUserByUserName) {
      throw new BadRequestException(['The user with this username already exists']);
    }

    user.username = createUserDto.username;
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;
    user.password = await this.authService.hashPassword(createUserDto.password);

    return {
      ...(await this.userRepository.save(user)),
      access_token: this.authService.getTokenForUser(user),
    };
  }

}