import { AsyncFunc, chunkedPromiseAll, chunkedPromiseMap } from './promise';

test('chunkedPromiseAll', async () => {
  const promises: AsyncFunc<number>[] = [];
  promises.push(async () => 1);
  promises.push(async () => 2);
  promises.push(async () => 3);
  promises.push(async () => 4);
  promises.push(async () => 5);
  promises.push(async () => 6);

  const res = await chunkedPromiseAll(promises, 2);
  expect(res).toStrictEqual([1, 2, 3, 4, 5, 6]);
});

test('chunkedPromiseAll with default chunk size', async () => {
  const promises: AsyncFunc<number>[] = [];
  promises.push(async () => 11);
  promises.push(async () => 12);
  promises.push(async () => 13);
  promises.push(async () => 14);
  promises.push(async () => 15);
  promises.push(async () => 16);

  const res = await chunkedPromiseAll(promises);
  expect(res).toStrictEqual([11, 12, 13, 14, 15, 16]);
});

test('chunkedPromiseMap', async () => {
  const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
  const res = await chunkedPromiseMap(arr, async (x) => `${x}a`, 2);

  expect(res).toStrictEqual(['aa', 'ba', 'ca', 'da', 'ea', 'fa']);
});

test('chunkedPromiseMap with default chunk size', async () => {
  const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
  const res = await chunkedPromiseMap(arr, async (x) => `${x}a`);

  expect(res).toStrictEqual(['aa', 'ba', 'ca', 'da', 'ea', 'fa']);
});

test('chunkedPromiseMap index', async () => {
  const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
  const res = await chunkedPromiseMap(arr, async (x, i) => `${i}-${x}`, 2);

  expect(res).toStrictEqual(['0-a', '1-b', '2-c', '3-d', '4-e', '5-f']);
});

test('chunkedPromiseMap index with default chunk size', async () => {
  const arr = ['a', 'b', 'c', 'd', 'e', 'f'];
  const res = await chunkedPromiseMap(arr, async (x, i) => `${i}-${x}`);

  expect(res).toStrictEqual(['0-a', '1-b', '2-c', '3-d', '4-e', '5-f']);
});
