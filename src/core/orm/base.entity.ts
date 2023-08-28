import { Filter, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { InternalServerErrorException } from '@nestjs/common';
import { ClsServiceManager } from 'nestjs-cls';
import { ContextStore } from '../context/context.store';

function getCurrentUser() {
  const user = ClsServiceManager.getClsService<ContextStore>().get('user');
  if (!user) throw new InternalServerErrorException('No user.');
  return user;
}

@Filter({ name: 'exist', cond: { deleted: 0 }, default: true })
export abstract class BaseEntity {
  [OptionalProps]?:
    | 'createdAt'
    | 'createdBy'
    | 'updatedAt'
    | 'updatedBy'
    | 'deleted';

  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date().toISOString();

  @Property()
  createdBy = getCurrentUser();

  @Property({ onUpdate: () => new Date().toISOString() })
  updatedAt = new Date().toISOString();

  @Property({ onUpdate: () => getCurrentUser() || null })
  updatedBy = getCurrentUser();

  @Property()
  deleted: boolean = false;
}
