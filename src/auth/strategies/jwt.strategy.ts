import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { IJwtPayloadValidate } from '../interfaces/IJwtPayloadValidate';
import { IJwtUser } from '../interfaces/IJwtUser';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  validate(payload: IJwtPayloadValidate): IJwtUser {
    return {
      id: payload.sub,
      email: payload.email,
      permission: payload.permission,
    };
  }
}
