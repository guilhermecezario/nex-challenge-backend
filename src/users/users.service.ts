import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { hash } from 'bcrypt';

import { PrismaService } from 'src/config/database/prisma/prisma.service';

import { AppError } from 'src/errors/AppError';

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

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
