import { EntityManager } from '@mikro-orm/core';

type NumberOrNull<T extends EntityManager | null> = T extends EntityManager
  ? number
  : null;

export function getTransactionId<T extends EntityManager | null>(
  em: T,
): NumberOrNull<T> {
  return (em?.id ?? null) as NumberOrNull<T>;
}
