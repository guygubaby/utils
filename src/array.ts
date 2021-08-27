import { clamp } from './math'
import { Nullable, Arrayable } from './types'

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
