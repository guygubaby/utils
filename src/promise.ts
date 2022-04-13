import type { Fn } from './types'

export const sleep = (ms: number, callback?: Fn) => {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      callback?.()
      resolve()
      clearTimeout(timer)
    }, ms)
  })
}

/**
 * Source: https://github.com/scopsy/await-to-js/blob/master/src/await-to-js.ts
 *
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error>(
  promise: Promise<T>,
  errorExt?: object,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
    if (errorExt) {
      const parsedError = Object.assign({}, err, errorExt)
      return [parsedError, undefined]
    }

    return [err, undefined]
  })
}

/**
 * Lock an async function to only be called once at a time
 * @param fn async function to be locked
 * @returns locked function
 *
 * ```typescript
 *   it('should lockPromsieFn works', async() => {
      const fn = vi.fn((num: number) => Promise.resolve(num))
      const lockFn = lockPromsieFn(fn)
      const ret = lockFn(1)
      const ret1 = lockFn(2)
      lockFn(3)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(await ret).toEqual(1)
      expect(await ret1).toBeUndefined()
    })
 *
 * ```
 */
export const lockPromsieFn = <T extends any[] = [], V = any>(fn: (...args: T) => Promise<V>) => {
  let lock = false

  return async function(...args: T) {
    if (lock) return
    lock = true
    try {
      const ret = await fn(...args)
      lock = false
      return ret
    }
    catch (error) {
      lock = false
      throw error
    }
  }
}

/**
 * Get the last result of a promise function
 * @param fn async function to be lasted handled
 * @returns last called result
 *
 * ```typescript
 *   it('should lastPromiseFn works', async() => {
      const fn = vi.fn((num: number) => Promise.resolve(num))
      const lastFn = lastPromiseFn(fn)
      const ret1 = lastFn(1)
      const ret2 = lastFn(2)
      const ret3 = lastFn(3)
      expect(fn).toBeCalledTimes(3)
      expect(ret1).resolves.toEqual(3)
      expect(ret2).resolves.toEqual(3)
      expect(ret3).resolves.toEqual(3)
    })
 * ```
 */
export const lastPromiseFn = <T extends any[] = [], V = any>(fn: (...args: T) => Promise<V>) => {
  let calledTimes = 0
  let resolvedTimes = 0

  return function(...args: T) {
    calledTimes++
    return new Promise<V>((resolve, reject) => {
      fn(...args).then((ret) => {
        if (++resolvedTimes === calledTimes) resolve(ret)
      }).catch(reject)
    })
  }
}
