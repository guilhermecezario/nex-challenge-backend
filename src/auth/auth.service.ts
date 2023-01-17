import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';

@Injectable()
export default class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  public async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    return user;
  }

  public async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      permission: user.permission,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
