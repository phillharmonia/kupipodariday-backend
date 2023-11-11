import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {LocalGuard} from "../guards/local.guard";

@Controller()
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return this.authService.auth(user);
  }
  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Request() req) {
    return this.authService.auth(req.user);
  }
}
