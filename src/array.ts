import { isFunction } from './is'
import { clamp } from './math'
import type { Arrayable, ItemGenerator, Nullable, PartialFunctions } from './types'

/**
 * Convert `Arrayable<T>` to `Array<T>`
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  if (Array.isArray(array))
    return array
  // @ts-expect-error ignore next line
  return [array]
}

/**
 * Convert `Arrayable<T>` to `Array<T>` and flatten it
 */
export function flattenArrayable<T>(array?: Nullable<Arrayable<T | Array<T>>>): Array<T> {
  return toArray(array).flat(1) as Array<T>
}

/**
 * get explicit index from target array, negative from backward
 * @param array target array to index
 * @param index the index you want to get from, can be negative
 * @returns the target array index, if not exists will return undefined
 */
export function at<T>(array: readonly T[], index: number): T | undefined {
  const len = array.length
  if (!len)
    return undefined
  if (index < 0)
    index += len
  return array[index]
}

/**
 * clamp index in ranged array
 * @param index index you want
 * @param array target array
 * @returns clamped index from array
 */
export function clampArrayRange<T>(index: number, array: readonly T[]): number {
  const len = array.length
  return clamp(index, 0, len - 1)
}

/**
 * get last indexed value from array
 * @param array target array
 * @returns last indexed value
 */
export function last<T>(array: readonly T[]): T | undefined {
  return at(array, -1)
}

/**
 * merge arrays in to one array
 * @param args arrays to be merged with
 * @returns merged array
 */
export function mergeArrayable<T>(...args: Nullable<Arrayable<T>>[]): T[] {
  return args.flatMap(item => toArray(item))
}

/**
 * Move element in an Array
 * @param arr target array to be move
 * @param from from index
 * @param to to index
 */
export function move<T>(arr: T[], from: number, to: number): T[] {
  arr.splice(to, 0, arr.splice(from, 1)[0])
  return arr
}

/**
 * Separate array using the passed function
 * @param array target array
 * @param filters function to Separate array
 * @returns tuple contain two seperated arrays
 */
export function partition<T>(array: T[], ...filters: PartialFunctions<T>): T[][] {
  const result: T[][] = Array.from({ length: filters.length + 1 }).fill(null).map(() => [])

  array.forEach((e, idx, arr) => {
    let i = 0
    for (const filter of filters) {
      if (filter(e, idx, arr)) {
        result[i].push(e)
        return
      }
      i += 1
    }
    result[i].push(e)
  })

  return result
}

/**
 * Genrate a range array of numbers. The stop is exclusive.
 * @param stop stop of array, start from `0`
 * @returns generated array
 */
export function range(stop: number): number[] {
  return Array.from({ length: stop }, (_, idx) => idx)
}

/**
 * Genrate a range array of numbers. The stop is exclusive.
 * @param start start of the index
 * @param stop stop of the index `exclude` in the target array
 * @returns generated array
 */
export function rangeWithStart(start: number, stop: number): number[] {
  return Array.from({ length: stop - start }, (_, idx) => start + idx)
}

/**
 * fill the array with given count and item
 * @param count count of the array
 * @param item `value` to fill the array or a `function` can access index
 */
export function fillWith<T>(count: number, item: T): T[]
export function fillWith<T>(count: number, itemGenerator: ItemGenerator<T>): T[]
export function fillWith<T>(count: number, item: ItemGenerator<T> | T): T[] {
  return Array.from({ length: count }, isFunction(item) ? item : () => item)
}

/**
 * Remove an item from Array
 * @param array target array
 * @param value item to remove
 * @returns whether success removed
 */
export function remove<T>(array: T[], value: T): boolean {
  if (!array)
    return false
  const index = array.indexOf(value)
  if (index >= 0) {
    array.splice(index, 1)
    return true
  }
  return false
}

/**
 * Unique an array
 * @param array target array
 * @returns unique array
 */
export function uniq<T>(array: T[]): T[] {
  if (!Array.isArray(array))
    return array
  return Array.from(new Set(array))
}

/**
 * Unique an array by a given function
 *
 * @category Array
 */
export function uniqBy<T>(array: readonly T[], prop: keyof T): T[]
export function uniqBy<T>(array: readonly T[], prop: (a: T, b: T) => boolean): T[]
export function uniqBy<T>(array: readonly T[], payload: (keyof T) | ((a: T, b: T) => boolean)): T[] {
  if (isFunction(payload)) {
    return array.reduce((acc, cur) => {
      const index = acc.findIndex(item => payload(item, cur))
      if (index === -1)
        acc.push(cur)
      return acc
    }, [] as T[])
  }

  return uniqBy(array, (a, b) => a[payload] === b[payload])
}

/**
 * Get random item from array
 *
 * @category Array
 */
export function sample<T>(array: readonly T[], count: number): T[] {
  return Array.from({ length: count }, () => array[Math.round(Math.random() * (array.length - 1))])
}

/**
 * Shuffle an array, this function will mutate the original array
 *
 * @category Array
 */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
