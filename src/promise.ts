import type { Fn, Nullable } from './types'

type ClearablePromise<T> = Promise<T> & {
  /**
   * clear pending task and resolve the promise
   */
  clear: Fn
}

export const sleep = (ms: number, callback?: Fn): ClearablePromise<void> => {
  let timer: Nullable<number> = null
  let resolveFn: Nullable<Fn> = null

  const clear = () => {
    resolveFn?.()
    resolveFn = null
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const p = new Promise<void>((resolve) => {
    resolveFn = resolve
    // @ts-expect-error ignore error for return type in node.js
    timer = setTimeout(() => {
      callback?.()
      clear()
    }, ms)
  })

  Object.defineProperty(p, 'clear', {
    value: clear,
    writable: false,
    enumerable: false,
    configurable: true,
  })

  return p as ClearablePromise<void>
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
 *   it('should lockPromiseFn works', async() => {
 *     const fn = vi.fn((num: number) => Promise.resolve(num))
 *     const lockFn = lockPromiseFn(fn)
 *     const ret = lockFn(1)
 *     const ret1 = lockFn(2)
 *     lockFn(3)
 *     expect(fn).toHaveBeenCalledTimes(1)
 *     expect(await ret).toEqual(1)
 *     expect(await ret1).toBeUndefined()
 *   })
 * ```
 */
export const lockPromiseFn = <T extends any[] = [], V = any>(fn: (...args: T) => Promise<V>) => {
  let lock = false

  return async function (...args: T) {
    if (lock)
      return
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

  return function (...args: T) {
    calledTimes++
    return new Promise<V>((resolve, reject) => {
      fn(...args).then((ret) => {
        if (++resolvedTimes === calledTimes)
          resolve(ret)
      }).catch(reject)
    })
  }
}

export interface SingletonPromiseReturn<T> {
  (): Promise<T>
  /**
   * Reset current staled promise.
   * Await it to have proper shutdown.
   */
  reset: () => Promise<void>
}

/**
 * Create singleton promise function, it can be called only once.
 *
 * And later you can reset it to make it can be called again.
 *
 * @category Promise
 * @example
 * ```typescript
 * it('should singletonPromiseFn works', async() => {
    let dummy = 0

    const fn = vi.fn(async() => {
      await sleep(10)
      dummy += 1
      return dummy
    })

    const promise = singletonPromiseFn(fn)
    expect(dummy).toBe(0)
    expect(fn).toBeCalledTimes(0)

    const res = await promise()
    expect(res).toBe(1)
    expect(fn).toBeCalledTimes(1)
    expect(dummy).toBe(1)

    // call wrapper again, but not call fn again, because it's staled
    const res1 = await promise()
    expect(res1).toBe(1)
    expect(fn).toBeCalledTimes(1)
    expect(await promise()).toBe(1)
    expect(fn).toBeCalledTimes(1)
    expect(dummy).toBe(1)

    // reset staled promise, make it can be called again
    await promise.reset()
    // call wrapper again, and call fn again
    const res2 = await promise()
    expect(res2).toBe(2)
    expect(fn).toBeCalledTimes(2)
    expect(dummy).toBe(2)
  })
 * ```
 */
export function singletonPromiseFn<T>(fn: () => Promise<T>): SingletonPromiseReturn<T> {
  let _promise: Promise<T> | undefined

  function wrapper() {
    if (!_promise)
      _promise = fn()
    return _promise
  }

  wrapper.reset = async () => {
    const _prev = _promise
    _promise = undefined
    if (_prev)
      await _prev
  }

  return wrapper
}

/**
 * Promise with `resolve` and `reject` methods of itself
 */
export interface ControlledPromise<T = void> extends Promise<T> {
  resolve(value: T | PromiseLike<T>): void
  reject(reason?: any): void
}

/**
 * Return a Promise with `resolve` and `reject` methods
 *
 * @category Promise
 * @example
 * ```typescript
 * const promise = createControlledPromise()
 * await promise
 * // in anther context:
 * promise.resolve(data)
 * ```
 */
export function createControlledPromise<T>(): ControlledPromise<T> {
  let resolve: any, reject: any
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  }) as ControlledPromise<T>
  promise.resolve = resolve
  promise.reject = reject
  return promise
}
