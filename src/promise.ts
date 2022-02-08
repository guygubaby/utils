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
