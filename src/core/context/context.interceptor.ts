import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';

import { ContextStore } from './context.store';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService<ContextStore>) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    this.cls.set('user', request.user?.sub);

    return next.handle();
  }
}
