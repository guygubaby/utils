/**
 * Clear undefined fields from an object. It mutates the object
 *
 * @category Object
 */
export function clearUndefined<T extends object>(obj: T): T {
  // @ts-expect-error
  Object.keys(obj).forEach((key: string) => (obj[key] === undefined ? delete obj[key] : {}))
  return obj
}

/**
 * Determines whether an object has a property with the specified name
 *
 * @see https://eslint.org/docs/rules/no-prototype-builtins
 * @category Object
 */
export function hasOwnProperty<T>(obj: T, v: PropertyKey) {
  if (obj == null) return false
  return Object.prototype.hasOwnProperty.call(obj, v)
}

/**
 * Create a new subset object by giving keys
 *
 * @category Object
 */
export function objectPick<O, T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
  return keys.reduce((n, k) => {
    if (k in obj)
      if (!omitUndefined || !obj[k] === undefined) n[k] = obj[k]
    return n
  }, {} as Pick<O, T>)
}

/**
 * Create a new subset object except giving keys
 *
 * @category Object
 */
export function objectOmit<O, T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
  return keys.reduce((acc, key) => {
    if (!(key in obj))
      if (!omitUndefined || !obj[k] === undefined) acc[k] = obj[k]
    return acc
  }, {} as Omit<O, T>)
}

/**
 * Type guard for any key, `k`.
 * Marks `k` as a key of `T` if `k` is in `obj`.
 *
 * @category Object
 * @param obj object to query for key `k`
 * @param k key to check existence in `obj`
 */
export function isKeyOf<T extends object>(obj: T, k: keyof any): k is keyof T {
  return k in obj
}
