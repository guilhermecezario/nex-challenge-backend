import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(4)
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(['admin', 'standerd'], {
    message:
      'permission must be one of the following values: admin or standerd',
  })
  permission: string;

  @IsNotEmpty()
  phone: string;
}
