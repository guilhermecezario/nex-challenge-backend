import { HttpException } from '@nestjs/common';

export class AppError {
  constructor(message: string[], error: string, statusCode = 400) {
    return new HttpException(
      HttpException.createBody(message, error, statusCode),
      statusCode,
    );
  }
}
