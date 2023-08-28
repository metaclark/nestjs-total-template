import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { PageController } from './controllers/page.controller';
import { Page } from './entities/page.entity';
import { PageService } from './services/page.service';
@Module({
  imports: [MikroOrmModule.forFeature([Page])],
  providers: [PageService],
  controllers: [PageController],
})
export class PageModule {}
