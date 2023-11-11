import {Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import {User} from "../users/entities/user.entity";
import {HashService} from "../hash/hash.service";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
        private hashService: HashService
    ) {}
    async auth (user: User) {
        const payload = { username: user.username, sub: user.id }
        return { access_token: this.jwtService.sign(payload)}
    }
    async validatePassword(username: string, password: string): Promise<any> {
        const user = await this.userService.findByUsername(username)
        const comparePassword = await this.hashService.comparePasswords(password, user.password)
        if (comparePassword) {
            const {password, ...result} = user
            return result;
        }
        throw new UnauthorizedException('Неверный пароль');
    }
}
