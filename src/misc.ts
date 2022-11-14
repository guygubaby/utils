import { isError } from './is'
import type { Fn } from './types'

/**
 * Opinionated uuid generator
 * @returns uuid string
 */
export const uuid = (): string => {
  return Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0'),
  ).join('')
}

/**
 * judge condition whether is `true` or throw error
 * @param condition judge condition
 * @param message if condition not `true` will throw this as error message
 */
export const assert = (condition: unknown, message?: string | Error | undefined): asserts condition => {
  if (!condition) {
    if (isError(message))
      throw message
    else throw new Error(message || 'assertion failed')
  }
}

export const toString = (v: any) => Object.prototype.toString.call(v)

/**
 * Do nothing
 */
export function noop() {}

/**
 * Get current timestamp in milliseconds
 */
export const timestamp = (): number => Date.now()

/**
 * Create a new object and it's __proto__ is null
 */
export const blankObject = () => Object.create(null)

/**
 * Run the given fn
 */
export const run = (fn: Fn) => fn()

/**
 * Run all functions in array
 */
export const runAll = (fns: Fn[]) => fns.forEach(run)

/**
 * Return a new function that ensure the passed function
 *
 * will be called at most once
 */
export const runOnce = (fn: Function) => {
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
export const hash = (str: string): number => {
  let hash = 5381
  let i = str.length

  while (i--) hash = ((hash << 5) - hash) ^ str.charCodeAt(i)
  return hash >>> 0
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
export const shallowArrayEqual = (arr1: any[], arr2: any[]) => {
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
export const looseArrayEqual = (arr1: any[], arr2: any[]) => {
  if (arr1 === arr2)
    return true

  if (arr1.length !== arr2.length)
    return false

  return arr1.every(v => arr2.includes(v))
}
