import { ClsStore } from 'nestjs-cls';

export interface ContextStore extends ClsStore {
  user?: string;
}
