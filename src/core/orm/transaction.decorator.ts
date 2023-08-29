import { MikroORM } from '@mikro-orm/core';

import { getMikroOrm } from '../di/orm';

export function Transactional<T>(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: T, ...args: any[]) {
      const em = getMikroOrm().em.getContext();
      await em.begin(); // start transaction

      let result: unknown;
      try {
        result = await originalMethod.apply(this, args);
        await em.commit(); // will flush before making the actual commit query
      } catch (err) {
        await em.rollback();
        throw err;
      }

      return result;
    };

    return descriptor;
  };
}

export function TransactionalWithContext<T>(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (this: T, ...args: any[]) {
      const orm = (this as any).orm;

      if (!(orm instanceof MikroORM)) {
        throw new Error(
          '@Transactional() decorator can only be applied to methods of classes with `orm: MikroORM` property',
        );
      }

      const em = (orm as MikroORM).em.getContext();
      await em.begin(); // start transaction

      let result: unknown;
      try {
        result = await originalMethod.apply(this, args);
        await em.commit(); // will flush before making the actual commit query
      } catch (err) {
        await em.rollback();
        throw err;
      }

      return result;
    };

    return descriptor;
  };
}
