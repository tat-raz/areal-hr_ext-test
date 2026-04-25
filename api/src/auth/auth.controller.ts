import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthenticatedGuard } from './authenticated.guard';


@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req) {
    return {
      message: 'Login successful',
      user: req.user,
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('me')
  me(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Post('logout')
  logout(@Req() req) {
    req.logout(() => {});
    return { message: 'Logout successful' };
  }
}