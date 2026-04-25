import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthService } from './auth.service';


@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private authService: AuthService) {
    super();
  }

  serializeUser(user: { id: number }, done: Function) {
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: Function) {
    const user = await this.authService.findUserById(userId);
    done(null, user);
  }
}