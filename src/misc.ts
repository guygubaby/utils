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
export const assert = (
  condition: unknown,
  message?: string | Error | undefined,
): asserts condition => {
  if (!condition) {
    if (isError(message))
      throw message
    else
      throw new Error(message || 'assertion failed')
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
