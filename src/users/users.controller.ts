import {
  Controller,
  Get,
  Body,
  Param,
  Request,
  UseGuards,
  Patch,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from '../guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  async getUser(@Request() req) {
    return await this.usersService.findById(req.user.id);
  }

  @Get('me/wishes')
  async getMeWishes(@Request() req) {
    return await this.usersService.findUserWishes(req.user.id);
  }
  @Get(':username')
  async getUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new NotFoundException('Пользователь с таким именем не сущетсвует');
    }
    return user;
  }
  @Get(':username/wishes')
  async getUsernameWishes(@Param('username') username: string) {
    const { id } = await this.usersService.findByUsername(username);
    return this.usersService.findUserWishes(id);
  }
  @Post('find')
  async findByQuery(@Body('query') query: string): Promise<User> {
    return await this.usersService.findMany(query);
  }

  @Patch('me')
  async updateMyProfile(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { id } = req.user;
    return await this.usersService.updateUser(id, updateUserDto);
  }
}
