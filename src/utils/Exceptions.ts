import { HttpException, HttpStatus } from '@nestjs/common';

export class Exceptions {
  userNotFound = new HttpException('User not found', HttpStatus.NOT_FOUND);

  instructorNotFound = new HttpException(
    'Instructor not found',
    HttpStatus.NOT_FOUND,
  );

  courseNotFound = new HttpException('Course not found', HttpStatus.NOT_FOUND);

  reviewNotFound = new HttpException('Review not found', HttpStatus.NOT_FOUND);

  notAuthorized = new HttpException(
    'You are not authorized to delete this review',
    401,
  );

  instructorAlreadyExists = new HttpException(
    'Instructor already exist',
    HttpStatus.METHOD_NOT_ALLOWED,
  );
}
