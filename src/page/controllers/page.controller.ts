import { success } from 'src/core/api/response';
import { PageService } from '../services/page.service';
import { pagesContract } from 'api-share/api/v0/pages/contract';
import {
  nestControllerContract,
  NestControllerInterface,
  NestRequestShapes,
  TsRest,
  TsRestRequest,
} from '@ts-rest/nest';
import { Transactional } from 'src/core/orm/transaction.decorator';
import { Controller } from '@nestjs/common';

const c = nestControllerContract(pagesContract);
type RequestShapes = NestRequestShapes<typeof c>;

@Controller()
export class PageController implements NestControllerInterface<typeof c> {
  constructor(private readonly pageService: PageService) {}

  @TsRest(c.get)
  async get(@TsRestRequest() request: RequestShapes['get']) {
    const page = await this.pageService.getOrFail(+request.params.id);
    return success(page);
  }

  @TsRest(c.create)
  @Transactional()
  async create(@TsRestRequest() request: RequestShapes['create']) {
    const page = await this.pageService.create(request.body);
    return success(page);
  }

  @TsRest(c.update)
  @Transactional()
  async update(@TsRestRequest() request: RequestShapes['update']) {
    const id = +request.params.id;
    const page = await this.pageService.update(id, request.body);
    return success(page);
  }

  @TsRest(c.delete)
  @Transactional()
  async delete(@TsRestRequest() request: RequestShapes['delete']) {
    await this.pageService.delete(+request.params.id);
    return success(undefined);
  }
}
