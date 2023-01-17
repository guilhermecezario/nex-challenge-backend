import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { hash } from 'bcrypt';

import { PrismaService } from 'src/config/database/prisma/prisma.service';

import { AppError } from 'src/errors/AppError';
import { IJwtUser } from 'src/auth/interfaces/IJwtUser';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create({ name, email, password, permission, phone }: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({ where: { email } });

    if (userExists) {
      throw new AppError(['User already exists'], 'Bad Request', 400);
    }

    const userPhoneExists = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (userPhoneExists) {
      throw new AppError(
        ['User already exists with this phone'],
        'Bad Request',
        400,
      );
    }

    const passwordHash = await hash(password, 8);

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        permission,
        phone,
      },
    });
  }

  findAll(loggedInUser: IJwtUser) {
    if (loggedInUser.permission != 'admin') {
      return this.prisma.user.findMany({
        where: {
          id: loggedInUser.id,
        },
      });
    }

    return this.prisma.user.findMany();
  }

  findOne(id: number, loggedInUser: IJwtUser) {
    if (loggedInUser.permission != 'admin' && loggedInUser.id != id) {
      throw new AppError(
        ['User does not have permission'],
        'User does not have permission',
        401,
      );
    }

    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(
    id: number,
    { name, email, password, permission, phone }: CreateUserDto,
    loggedInUser: IJwtUser,
  ) {
    if (loggedInUser.permission != 'admin' && loggedInUser.id != id) {
      throw new AppError(
        ['User does not have permission'],
        'User does not have permission',
        401,
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new AppError(['User not exists'], 'Bad Request', 400);
    }

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userExists && userExists.id !== user.id) {
      throw new AppError(['User already exists'], 'Bad Request', 400);
    }

    const userPhoneExists = await this.prisma.user.findUnique({
      where: { phone },
    });

    if (userPhoneExists && userPhoneExists.id !== user.id) {
      throw new AppError(
        ['User already exists with this phone'],
        'Bad Request',
        400,
      );
    }

    const passwordHash = await hash(password, 8);

    return this.prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: password ? passwordHash : user.password,
        permission,
        phone,
      },
    });
  }
}
