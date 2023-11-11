import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { Strategy } from 'passport-local';
import {User} from "../users/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username:string, password:string) {
    const user = await this.authService.validatePassword(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}