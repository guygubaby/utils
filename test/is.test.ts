import { isBoolean, isBrowser, isDef, isFunction, isLooseFalsy, isNumber, isObject, isStrictFalsy, isString, isWindow } from '../src/is'

describe('test is module', () => {
  it('should is works', () => {
    expect(isBrowser()).toEqual(false)

    expect(isDef(1)).toBe(true)
    expect(isDef(null)).toBe(true)
    let a
    expect(isDef(a)).toBe(false)
    expect(isDef()).toBe(false)

    expect(isBoolean(true)).toEqual(true)
    expect(isBoolean(1)).toEqual(false)

    expect(isFunction(() => {})).toEqual(true)

    expect(isNumber(() => {})).toEqual(false)
    expect(isNumber(1)).toEqual(true)

    expect(isString(1)).toEqual(false)
    expect(isString('1')).toEqual(true)

    expect(isObject('1')).toEqual(false)
    expect(isObject({})).toEqual(true)
    expect(isObject(null)).toEqual(false)
    expect(isObject(() => {})).toEqual(false)

    expect(isWindow(() => {})).toEqual(false)

    expect(isLooseFalsy()).toEqual(true)
    expect(isLooseFalsy('')).toEqual(true)
    expect(isLooseFalsy(0)).toEqual(false)

    expect(isStrictFalsy()).toEqual(true)
    expect(isStrictFalsy('')).toEqual(true)
    expect(isStrictFalsy(0)).toEqual(true)
    expect(isStrictFalsy(1)).toEqual(false)
  })
})
