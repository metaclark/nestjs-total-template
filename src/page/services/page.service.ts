import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { CreatePageDto, UpdatePageDto } from '../dto/page.dto';
import { Page } from '../entities/page.entity';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page) private readonly pageRepo: EntityRepository<Page>,
    private em: EntityManager,
  ) {}

  async getOrFail(id: number): Promise<Page> {
    return this.pageRepo.findOneOrFail(id);
  }

  async create(data: CreatePageDto): Promise<Page> {
    const page = await this.pageRepo.create(data);
    await this.em.flush();
    return page;
  }

  async update(id: number, data: UpdatePageDto): Promise<Page> {
    const page = await this.getOrFail(id);

    wrap(page).assign(data);

    return page;
  }

  async delete(id: number): Promise<void> {
    const page = await this.getOrFail(id);
    page.deleted = true;
  }
}
