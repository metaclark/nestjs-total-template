import { createMock } from '@golevelup/ts-jest';
import { EntityManager } from '@mikro-orm/core';

import { getTransactionId } from './transaction';

describe('getTransactionId', () => {
  it('should return null', () => {
    const txId = getTransactionId(null);
    expect(txId).toBe(null);
  });

  it('should return null when id is undefined', () => {
    const em = createMock<EntityManager>({
      get id(): number | undefined {
        return undefined;
      },
    });
    const txId = getTransactionId(em);
    expect(txId).toBe(null);
  });

  it('should return 10', () => {
    const em = createMock<EntityManager>({
      get id(): number {
        return 10;
      },
    });
    const txId = getTransactionId(em);
    expect(txId).toBe(10);
  });

  it('should return 0', () => {
    const em = createMock<EntityManager>({
      get id(): number {
        return 0;
      },
    });
    const txId = getTransactionId(em);
    expect(txId).toBe(0);
  });
});
