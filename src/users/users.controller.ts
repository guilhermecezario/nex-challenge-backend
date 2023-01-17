import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Public } from 'src/auth/decoradors/Public';
import { JwtAuthAdminGuard } from 'src/auth/guards/jwt-auth-admin.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @UseGuards(JwtAuthAdminGuard)
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.usersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() req) {
    return this.usersService.findOne(Number(id), req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.usersService.update(Number(id), updateUserDto, req.user);
  }
}
