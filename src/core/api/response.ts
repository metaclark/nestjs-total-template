type Result<T> = T extends undefined ? undefined : Awaited<T>;

export async function success<T = undefined>(body?: T | Promise<T>) {
  return {
    status: 200 as const,
    body: (await body) as Result<T>,
  };
}
