import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { hash } from 'bcrypt';

import { PrismaService } from 'src/config/database/prisma/prisma.service';

import { AppError } from 'src/errors/AppError';
import { IJwtUser } from 'src/auth/interfaces/IJwtUser';
import { IQueryFindAll } from './interfaces/IQueryFindAll';

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
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });
  }

  findAll({ name, email }: IQueryFindAll, loggedInUser: IJwtUser) {
    if (loggedInUser.permission != 'admin') {
      return this.prisma.user.findMany({
        where: {
          id: loggedInUser.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });
    }

    return this.prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
        email: {
          contains: email,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });
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
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        permission: true,
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
    { name, email, password, permission, phone }: UpdateUserDto,
    loggedInUser: IJwtUser,
  ) {
    if (loggedInUser.permission != 'admin' && loggedInUser.id != id) {
      throw new AppError(
        ['User does not have permission'],
        'User does not have permission',
        401,
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: Number(id) },
    });

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
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });
  }
}
