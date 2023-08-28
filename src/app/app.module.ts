import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PageModule } from 'src/page/page.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroConfig from 'src/config/mikro.config';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/core/exception/exception.filter';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            query: req.query,
          }),
          res: (res) => ({
            statusCode: res.statusCode,
          }),
        },
      },
    }),
    MikroOrmModule.forRoot({
      ...mikroConfig,
      autoLoadEntities: true,
    }),
    PageModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}
