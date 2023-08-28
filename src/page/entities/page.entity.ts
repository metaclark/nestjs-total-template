import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/core/orm/base.entity';

@Entity()
export class Page extends BaseEntity {
  @Property({ length: 200 })
  title!: string;

  @Property({ length: 200, nullable: true })
  content?: string;
}
