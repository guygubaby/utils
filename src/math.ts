import { flattenArrayable } from './array'

/**
 * Like css clamp expression
 * @param n the basic value
 * @param min the minumum value
 * @param max the max value
 * @returns the value between min and max
 */
export const clamp = (n: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, n))
}

/**
 * @param args array of
 * @returns sum of args
 */
export const sum = (...args: number[] | number[][]): number => {
  return flattenArrayable(args).reduce((sum, value) => sum + value, 0)
}
