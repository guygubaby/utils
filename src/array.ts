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
