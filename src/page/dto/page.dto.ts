import { nestControllerContract, NestRequestShapes } from '@ts-rest/nest';
import { pagesContract } from 'api-share/api/v0/pages/contract';

const c = nestControllerContract(pagesContract);

type RequestShapes = NestRequestShapes<typeof c>;

export type CreatePageDto = RequestShapes['create']['body'];
export type UpdatePageDto = RequestShapes['update']['body'];
