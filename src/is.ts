import { toString } from './misc'

export function isBrowser(): boolean {
  return typeof window !== 'undefined'
}
export function isDef<T = any>(val?: T): val is T {
  return typeof val !== 'undefined'
}
export function isBoolean(val?: any): val is boolean {
  return typeof val === 'boolean'
}
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(val?: any): val is Function {
  return typeof val === 'function'
}
export function isNumber(val?: any): val is number {
  return typeof val === 'number'
}
export function isString(val?: unknown): val is string {
  return typeof val === 'string'
}
export function isObject(val?: any): val is object {
  return toString(val) === '[object Object]'
}
export function isWindow(val?: any): val is Window {
  return toString(val) === '[object Window]' && typeof window !== 'undefined'
}
export function isError(val?: any): val is Error {
  return toString(val) === '[object Error]' && val instanceof Error
}

/**
 * @param val value to be judge
 * @returns whether value is in `['', null, undefined]`
 */
export function isLooseFalsy(val?: any): boolean {
  return ['', null, undefined].includes(val)
}

/**
 * @param val value to be judge
 * @returns whether value is in `['', null, undefined, 0]`
 */
export function isStrictFalsy(val?: any): boolean {
  return ['', null, undefined, 0].includes(val)
}

/**
 * @param val value to be judge
 * @returns whether value is not in `['', null, undefined]`
 */
export function isLooseTruthy(val?: any): boolean {
  return !isLooseFalsy(val)
}

/**
 * @param val value to be judge
 * @returns whether value is not in `['', null, undefined, 0]`
 */
export function isStrictTruthy(val?: any): boolean {
  return !isStrictFalsy(val)
}

/**
 * Judge whether value is object and have no property
 * @param val value to be judge
 */
export function isEmptyObject(val?: any): boolean {
  return isObject(val) && Object.keys(val).length === 0
}

/**
 * Judge whether is in browser
 */
export const isClient = isBrowser()

/**
 * Judge whether object is promise
 * @param val value to be judge
 * @returns whether value is promise
 */
export function isPromise<T>(val: any): val is Promise<T> {
  return val
    && toString(val) === '[object Promise]'
    && isFunction(val.then)
    && isFunction(val.catch)
    && val instanceof Promise
}
