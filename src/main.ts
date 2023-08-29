import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import './config/config';
import { setNestApp } from './core/di/app';
import { setMikroOrm } from './core/di/orm';
import { MikroORM } from '@mikro-orm/core';
import { Logger } from 'nestjs-pino';
import { generateOpenApi } from '@ts-rest/open-api';
import { apiContract } from 'api-share/api/contract';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { FastifyAdapter } from '@nestjs/platform-fastify';

const bootstrapNestJSSwagger = async (app: INestApplication) => {
  const document = generateOpenApi(apiContract, {
    info: {
      title: 'My Studio - APIs',
      description: 'Document for My Studio APIs',
      version: '0.0.1',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  });

  SwaggerModule.setup('docs', app, document);
};

async function bootstrap() {
  const adapter = new FastifyAdapter();

  const app = await NestFactory.create(AppModule, adapter);

  app.useLogger(app.get(Logger));

  setNestApp(app);
  setMikroOrm(app.get(MikroORM));

  bootstrapNestJSSwagger(app);

  await app.listen(3000);
}
bootstrap();
