import { toArray } from './array'
import { isDef, isObject } from './is'

/**
 * Clear undefined fields from an object. It mutates the object
 *
 * @category Object
 */
export function clearUndefined<T extends object>(obj: T): T {
  // @ts-expect-error ignore key type error
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
  if (obj == null)
    return false
  return Object.prototype.hasOwnProperty.call(obj, v)
}

/**
 * Create a new subset object by giving keys
 *
 * @category Object
 */
export function objectPick<O extends object, T extends keyof O>(obj: O, keys: T[], omitUndefined = false) {
  return keys.reduce((acc, k) => {
    if (k in obj) {
      const value = obj[k]
      if (!omitUndefined || isDef(value))
        acc[k] = value
    }
    return acc
  }, {} as Pick<O, T>)
}

/**
 * Create a new subset object except giving keys
 *
 * @category Object
 */
export function objectOmit<O extends object, T extends keyof O>(obj: O, keys: T[] | T, omitUndefined = false) {
  const oldKeys = Object.keys(obj) as T[]
  return oldKeys.reduce((acc, key) => {
    if (!toArray(keys).includes(key)) {
      if (!omitUndefined || !obj[key] === undefined) {
        // @ts-expect-error ignore key type error
        acc[key] = obj[key]
      }
    }
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

/**
 * get property deeply
 * @param obj Object
 * @param path path of the property
 * @returns the value of the property
 */
export function getDeep<T extends Record<string, any>>(obj: T, path: string) {
  try {
    return path.split('.').reduce((acc, key) => acc[key], obj)
  }
  catch (_) {
    return undefined
  }
}

function executor(
  target: Record<any, any>,
  index: number,
  options: Record<string, Function> = {},
) {
  for (const key in options) {
    const result = key.split('.').reduce((pre, cur) => pre[cur], target)
    options[key](result, index, target)
  }
}

/**
 * 通过函数的方式获取对象中指定的数据
 * @param { Record<any, any> | any[] } target 对象或数组
 * @param { Record<string, Function> } options {}
 * @returns
 */
export function traverse<T extends Record<any, any> | any[]>(
  target: T,
  options: Record<string, (res: any, i: number, target: T) => void> = {},
) {
  if (!isObject(target))
    return target
  Array.isArray(target)
    ? target.forEach((item, index) => executor(item, index, options))
    : executor(target, 0, options)
  return target
}
