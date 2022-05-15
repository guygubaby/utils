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
