/**
 * Memorize a promsie function for one time use.
 */
export function memorizePromise<T>(fn: () => Promise<T>): () => Promise<T> {
  let cache: T
  let hasRun = false

  return async () => {
    if (!hasRun) {
      hasRun = true
      cache = await fn()
    }
    return cache
  }
}

/**
 * Memorize a function for one time use.
 */
export function memorize<T>(fn: () => T): () => T {
  let cache: T
  let hasRun = false

  return () => {
    if (!hasRun) {
      hasRun = true
      cache = fn()
    }
    return cache
  }
}

/**
 * 函数缓存结果
 * @param { Function } fn 函数
 * @returns
 */
export function memorizeFn(
  fn: Function,
  cache: Map<string, string> = new Map(),
): (...args: any[]) => any {
  return function (...args: any[]) {
    const _args = JSON.stringify(args)
    if (cache.has(_args))
      return cache.get(_args)
    const result = fn.apply(fn, args)
    cache.set(_args, result)
    return result
  }
}
