import {
  NotFoundError,
  UniqueConstraintViolationException,
} from '@mikro-orm/core';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    // SQL exception
    if (exception instanceof UniqueConstraintViolationException) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.sqlMessage,
        path: request.url,
      });
    }

    if (exception instanceof NotFoundError) {
      return response.status(HttpStatus.BAD_REQUEST).send({
        statusCode: HttpStatus.BAD_REQUEST,
        message: exception.message,
        path: request.url,
      });
    }

    if (exception instanceof BadRequestException) {
      const res = exception.getResponse();
      if (typeof res === 'object' && 'name' in res && res.name === 'ZodError') {
        const zodError = res as ZodError;
        return response.status(HttpStatus.BAD_REQUEST).send({
          statusCode: HttpStatus.BAD_REQUEST,
          message: zodError.issues.map(
            (i) => `${i.path.join('.')}: ${i.message}`,
          ),
          path: request.url,
        });
      }
    }

    // const httpStatus =
    //   exception instanceof HttpException
    //     ? exception.getStatus()
    //     : HttpStatus.INTERNAL_SERVER_ERROR;

    //base filter
    return super.catch(exception, host);
  }
}
