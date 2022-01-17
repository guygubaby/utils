import type { Fn } from './types'

/**
 * nano uuid generator
 * @returns uuid string
 */
export const uuid = (): string => {
  return Array.from({ length: 16 }, () =>
    Math.trunc(Math.random() * 256)
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
  condition: boolean,
  message: string,
): asserts condition => {
  if (!condition) throw new Error(message)
}

export const toString = (v: any) => Object.prototype.toString.call(v)

/**
 * Do nothing
 */
export const noop = () => {}

export const timestamp = (): number => Date.now()

export const run = (fn: Fn) => fn()

export const blankObject = () => Object.create(null)

export const runAll = (fns: Fn[]) => fns.forEach(run)

export const runOnce = (fn: Function) => {
  let ran = false
  return function(this: any, ...args: any[]) {
    if (ran) return
    ran = true
    fn.apply(this, args)
  }
}
