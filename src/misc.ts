import { isError } from './is'
import type { Fn } from './types'

/**
 * Opinionated uuid generator
 * @returns uuid string
 */
export function uuid(): string {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0')).join('')
}

/**
 * judge condition whether is `true` or throw error
 * @param condition judge condition
 * @param message if condition not `true` will throw this as error message
 */
export function assert(condition: unknown, message?: string | Error | undefined): asserts condition {
  if (!condition) {
    if (isError(message))
      throw message
    else throw new Error(message || 'assertion failed')
  }
}

export function toString(v: any) {
  return Object.prototype.toString.call(v)
}

/**
 * Do nothing
 */
export function noop() {}

/**
 * Get current timestamp in milliseconds
 */
export function timestamp(): number {
  return Date.now()
}

/**
 * Create a new object and it's __proto__ is null
 */
export function blankObject() {
  return Object.create(null)
}

/**
 * Run the given fn
 */
export function run(fn: Fn) {
  return fn()
}

/**
 * Run all functions in array
 */
export function runAll(fns: Fn[]) {
  return fns.forEach(run)
}

/**
 * Return a new function that ensure the passed function
 *
 * will be called at most once
 */
export function runOnce(fn: (...args: any[]) => any) {
  let ran = false
  return function (this: any, ...args: any[]) {
    if (ran)
      return
    ran = true
    fn.apply(this, args)
  }
}

/**
 * https://github.com/darkskyapp/string-hash/blob/master/index.js
 *
 * Nano version of string hash
 */
export function hash(str: string): number {
  let hash = 5381
  let i = str.length

  while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i)
  return hash >>> 0
}

/**
 * Simple hash function
 */
export function simpleHash(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash &= hash // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36)
}

/**
 * generate a salt string from given string
 *
 * same string will always generate same salt string
 */
export function salt(str: string, len = 16): string {
  const hash = simpleHash(str)
  return `${hash}`.padEnd(len, '0')
}

/**
 * Check if two arrays are shallow equal, this also checks if the two arrays are in the same order
 *
 * example:
 * ```ts
 * it('test shallowArrayEqual function', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 3]
    const arr3 = [1, 3, 2]

    expect(shallowArrayEqual(arr1, arr2)).toBeTruthy()
    expect(shallowArrayEqual(arr1, arr3)).toBeFalsy()
 * ```
 */
export function shallowArrayEqual(arr1: any[], arr2: any[]) {
  if (arr1 === arr2)
    return true

  if (arr1.length !== arr2.length)
    return false

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i])
      return false
  }

  return true
}

/**
 * Check if two objects are loose equal, this will not check whether the two arrays are in the same order
 *
 * example:
 * ```ts
 *   it('test looseArrayEqual function', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 3]
    const arr3 = [1, 3, 2]
    const arr4 = [1, 2, 3, 4]

    expect(looseArrayEqual(arr1, arr2)).toBeTruthy()
    expect(looseArrayEqual(arr1, arr3)).toBeTruthy()
    expect(looseArrayEqual(arr1, arr4)).toBeFalsy()
  })
 * ```
 */
export function looseArrayEqual(arr1: any[], arr2: any[]) {
  if (arr1 === arr2)
    return true

  if (arr1.length !== arr2.length)
    return false

  return arr1.every(v => arr2.includes(v))
}

/**
 * Caveats: do not use index to get from returned value
 *
 * Do not like this: `isomorphic[0]` or `isomorphic[1]`
 *
 * Just use const `[foo, bar] = isomorphic`
 *
 * ```ts
 * it('should createIsomorphicDestructurable works', () => {
    const foo = 'foo'
    const bar = 2

    const obj = { foo, bar }
    const arr = [foo, bar]

    const isomorphic = createIsomorphicDestructurable(obj, arr)

    expect(isomorphic.foo).toBe(foo)
    expect(isomorphic.bar).toBe(bar)

    const [foo1, bar1] = isomorphic
    expect(foo1).toBe(foo)
    expect(bar1).toBe(bar)
  })
  ```
 */
export function createIsomorphicDestructurable<
T extends Record<string, unknown>,
A extends readonly any[],
>(obj: T, arr: A): T & A {
  const clone = { ...obj }

  Object.defineProperty(clone, Symbol.iterator, {
    enumerable: false,
    value() {
      let index = 0
      return {
        next: () => ({
          value: arr[index++],
          done: index > arr.length,
        }),
      }
    },
  })

  return clone as T & A
}

export function removeEmpty<T = any>(data: T): T {
  if (!data) {
    return data
  }
  if (Array.isArray(data)) {
    return data.filter(e => e !== undefined) as any
  }
  const res = {} as any
  for (const key in data) {
    if (data[key] !== undefined) {
      res[key] = data[key]
    }
  }
  return res
}
