import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';

import AuthService from './auth.service';

@Controller('sessions')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
