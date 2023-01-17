import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { Injectable } from '@nestjs/common';
import { AppError } from 'src/errors/AppError';

import { IJwtPayloadValidate } from '../interfaces/IJwtPayloadValidate';
import { IJwtUser } from '../interfaces/IJwtUser';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  validate(payload: IJwtPayloadValidate): IJwtUser {
    if (payload.permission != 'admin') {
      throw new AppError(
        ['User does not have permission'],
        'Unauthorized',
        401,
      );
    }

    return {
      id: payload.sub,
      email: payload.email,
      permission: payload.permission,
    };
  }
}
