import { isFunction } from './is'
import { clamp } from './math'
import type { Arrayable, ItemGenerator, Nullable, PartialFunctions } from './types'

/**
 * Convert `Arrayable<T>` to `Array<T>`
 */
export function toArray<T>(array?: Nullable<Arrayable<T>>): Array<T> {
  array = array || []
  if (Array.isArray(array))
    return array
  return [array]
}

/**
 * Convert `Arrayable<T>` to `Array<T>` and flatten it
 */
export const flattenArrayable = <T>(array?: Nullable<Arrayable<T | Array<T>>>): Array<T> => {
  return toArray(array).flat(1) as Array<T>
}

/**
 * get explicit index from target array, negative from backward
 * @param array target array to index
 * @param index the index you want to get from, can be negative
 * @returns the target array index, if not exists will return undefined
 */
export const at = <T>(array: readonly T[], index: number): T | undefined => {
  const len = array.length
  if (!len) return undefined
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
export const clampArrayRange = <T>(index: number, array: readonly T[]): number => {
  const len = array.length
  return clamp(index, 0, len - 1)
}

/**
 * get last indexed value from array
 * @param array target array
 * @returns last indexed value
 */
export const last = <T>(array: readonly T[]): T | undefined => {
  return at(array, -1)
}

/**
 * merge arrays in to one array
 * @param args arrays to be merged with
 * @returns merged array
 */
export const mergeArrayable = <T>(...args: Nullable<Arrayable<T>>[]): T[] => {
  return args.flatMap(item => toArray(item))
}

/**
 * Move element in an Array
 * @param arr target array to be move
 * @param from from index
 * @param to to index
 */
export const move = <T>(arr: T[], from: number, to: number): T[] => {
  arr.splice(to, 0, arr.splice(from, 1)[0])
  return arr
}

/**
 * Seperate array using the passed function
 * @param array target array
 * @param filters function to seperate array
 * @returns tuple contain two seperated arrays
 */
export const partition = <T>(array: T[], ...filters: PartialFunctions<T>): T[][] => {
  const result: T[][] = new Array(filters.length + 1).fill(null).map(() => [])

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
export const range = (stop: number): number[] => {
  return Array.from({ length: stop }, (_, idx) => idx)
}

/**
 * Genrate a range array of numbers. The stop is exclusive.
 * @param start start of the index
 * @param stop stop of the index `exclude` in the target array
 * @returns generated array
 */
export const rangeWithStart = (start: number, stop: number): number[] => {
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
export const remove = <T>(array: T[], value: T): boolean => {
  if (!array) return false
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
 * @returns uniqued array
 */
export const uniq = <T>(array: T[]): T[] => {
  if (!Array.isArray(array)) return array
  return Array.from(new Set(array))
}
