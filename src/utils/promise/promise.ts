export type AsyncFunc<T = void> = () => Promise<T>;

export async function chunkedPromiseAll<T>(
  promises: AsyncFunc<T>[],
  chunkSize = 10,
) {
  const result: T[] = [];
  for (let i = 0; i < promises.length; i += chunkSize) {
    const chunkQueue = promises.slice(i, i + chunkSize);
    const res = await Promise.all(chunkQueue.map((p) => p()));
    result.push(...res);
  }

  return result;
}

export async function chunkedPromiseMap<K, V>(
  items: K[],
  mapFunc: (k: K, i: number) => Promise<V>,
  chunkSize = 10,
) {
  const promises: AsyncFunc<V>[] = [];
  for (const [i, item] of items.entries()) {
    promises.push(async () => mapFunc(item, i));
  }

  return chunkedPromiseAll(promises, chunkSize);
}
