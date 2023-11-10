import { default as _PCancelable } from 'p-cancelable'
import { default as _PQueue } from 'p-queue'
import { remove } from './array'
import { noop } from './misc'
import type { Fn, Nullable } from './types'

export { default as pTimeout } from 'p-timeout'

/**
 * ```ts
 * const cancelablePromise = new PCancelable((resolve, reject, onCancel) => {
	const worker = new SomeLongRunningOperation();

	onCancel(() => {
		worker.close();
	});

	worker.on('finish', resolve);
	worker.on('error', reject);
});

// Cancel the operation after 10 seconds
setTimeout(() => {
	cancelablePromise.cancel('Unicorn has changed its color');
}, 10000);

try {
	console.log('Operation finished successfully:', await cancelablePromise);
} catch (error) {
	if (cancelablePromise.isCanceled) {
		// Handle the cancelation here
		console.log('Operation was canceled');
		return;
	}

	throw error;
}
```
 */
export const PCancelable = _PCancelable

/**
 * Promise queue with concurrency control

 * Here we run only one promise at the time. For example, set concurrency to 4 to run four promises at the same time.

 * ```ts
 *  import PQueue from 'p-queue';
    import got from 'got';

    const queue = new PQueue({concurrency: 1});

    (async () => {
      await queue.add(() => got('https://sindresorhus.com'));
      console.log('Done: sindresorhus.com');
    })();

    (async () => {
      await queue.add(() => got('https://avajs.dev'));
      console.log('Done: avajs.dev');
    })();

    (async () => {
      const task = await getUnicornTask();
      await queue.add(task);
      console.log('Done: Unicorn task');
    })();
```
 */
export const PQueue = _PQueue

export function wait(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      resolve()
    }, ms)

    if (!signal || signal.aborted) return

    signal.addEventListener(
      'abort',
      () => {
        clearTimeout(timer)
      },
      { once: true }
    )
  })
}

export type ClearablePromise = Promise<void> & {
  /**
   * clear pending task
   */
  clear: Fn
}

export function sleep(ms: number, callback?: Fn): ClearablePromise {
  let timer: Nullable<number> = null

  const clear = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  const p = new Promise<void>((resolve) => {
    // @ts-expect-error ignore error for return type in node.js
    timer = setTimeout(() => {
      callback?.()
      resolve()
    }, ms)
  })

  Object.defineProperty(p, 'clear', {
    value: clear,
    writable: false,
    enumerable: false,
    configurable: true,
  })

  return p as ClearablePromise
}

/**
 * Source: https://github.com/scopsy/await-to-js/blob/master/src/await-to-js.ts
 *
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
export function to<T, U = Error>(promise: Promise<T>, errorExt?: object): Promise<[U, undefined] | [null, T]> {
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
export function lockPromiseFn<T extends any[] = [], V = any>(fn: (...args: T) => Promise<V>) {
  let lock = false

  return async function (...args: T) {
    if (lock) return
    lock = true
    try {
      const ret = await fn(...args)
      lock = false
      return ret
    } catch (error) {
      lock = false
      throw error
    }
  }
}

export interface RetryOptions {
  /**
   * max retry times
   */
  readonly times?: number
  /**
   * fn to called when retry
   */
  readonly onFail?: (error: Error) => void | Promise<void>
}

/**
 * Retry a function until it succeeds or times out
 * @param fn async function to be retried
 * @param options retry options
 * @returns retried function
 *
 * ```typescript
 * it('should retryPromiseFn works', async () => {
      const fn = vi.fn(() => Promise.resolve('done'))
      const retryFn = retryPromiseFn(fn)
      expect(retryFn()).resolves.toEqual('done')

      const times = 3
      const errorFn = vi.fn(() => Promise.reject(new Error('error')))
      const onFail = vi.fn(async () => {
        await sleep(10)
      })
      const retryFn2 = retryPromiseFn(errorFn, { times, onFail })
      await expect(retryFn2()).rejects.toThrowError('error')
      expect(onFail).toHaveBeenCalledTimes(times)
    })
  * ```
 */
export function retryPromiseFn<T extends any[] = [], V = any>(fn: (...args: T) => Promise<V>, options: RetryOptions | undefined = {}) {
  const { times = 3, onFail = noop } = options

  return async function (...args: T) {
    for (let i = 0; i < times; i++) {
      try {
        return await fn(...args)
      } catch (error) {
        await Promise.resolve(onFail(error as Error))
        if (i === times - 1) throw error
      }
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
export function lastPromiseFn<T extends any[] = [], V = any>(fn: (...args: T) => Promise<V>) {
  let calledTimes = 0
  let resolvedTimes = 0

  return function (...args: T) {
    calledTimes++
    return new Promise<V>((resolve, reject) => {
      fn(...args)
        .then((ret) => {
          if (++resolvedTimes === calledTimes) resolve(ret)
        })
        .catch(reject)
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
    if (!_promise) _promise = fn()
    return _promise
  }

  wrapper.reset = async () => {
    const _prev = _promise
    _promise = undefined
    if (_prev) await _prev
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

/**
 * Create a promise lock
 *
 * @category Promise
 * @example
 * ```
 * const lock = createPromiseLock()
 *
 * lock.run(async () => {
 *   await doSomething()
 * })
 *
 * // in anther context:
 * await lock.wait() // it will wait all tasking finished
 * ```
 */
export function createPromiseLock() {
  const locks: Promise<any>[] = []

  return {
    async run<T = void>(fn: () => Promise<T>): Promise<T> {
      const p = fn()
      locks.push(p)
      try {
        return await p
      } finally {
        remove(locks, p)
      }
    },
    async wait(): Promise<void> {
      await Promise.allSettled(locks)
    },
    isWaiting() {
      return Boolean(locks.length)
    },
    clear() {
      locks.length = 0
    },
  }
}

/**
 * Delay a promise a minimum amount of time.
 */
export async function pMinDelay<T>(
  promise: PromiseLike<T>,
  minimalDelay: number,
  {
    delayRejection = true,
  }: {
    /**
      Delay the rejection.

      Turn this off if you want a rejected promise to fail fast.

      @default true
	*/
    readonly delayRejection?: boolean
  } = {}
) {
  const delayPromise = sleep(minimalDelay)
  await (delayRejection ? delayPromise : Promise.all([promise, delayPromise]))
  return promise
}

/**
  @returns A promise that is resolved in the next event loop - think [`setImmediate()`](https://nodejs.org/api/timers.html#timers_setimmediate_callback_arg).

  @example
  ```
  import pImmediate from 'p-immediate';

  await pImmediate();

  // Executed in the next event loop
  console.log('🦄');
  ```
*/
export default function pImmediate() {
  return new Promise((resolve) => {
    if (typeof setImmediate === 'function') {
      setImmediate(resolve)
    } else {
      setTimeout(resolve)
    }
  })
}
