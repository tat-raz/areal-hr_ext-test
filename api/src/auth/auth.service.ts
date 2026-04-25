import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(login: string, password: string) {
    const user = await this.usersService.findByLogin(login);

    if (!user) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const isPasswordValid = await argon2.verify(
      user.password_hash,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid login or password');
    }

    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  async findUserById(id: number) {
    return this.usersService.findAuthUserById(id);
  }
}


