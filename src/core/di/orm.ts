import { MikroORM } from '@mikro-orm/core';

let mikroOrm: MikroORM | undefined = undefined;

export function getMikroOrm(): MikroORM {
  if (!mikroOrm) throw new Error('ORM is not initialized');
  return mikroOrm;
}

export function setMikroOrm(orm: MikroORM) {
  mikroOrm = orm;
}
