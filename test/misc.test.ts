import { describe, expect, it, vi } from 'vitest'
import { assert, blankObject, createIsomorphicDestructurable, looseArrayEqual, noop, run, runAll, runOnce, salt, shallowArrayEqual, simpleHash, uuid } from '../src/misc'
import { isKeyOf } from '../src'
import { isEmptyObject } from '../src/is'

describe('should misc module works', () => {
  it('test uuid', () => {
    expect(uuid().length).toBe(32)
  })

  it('test run function', () => {
    const fn = vi.fn(noop)
    run(fn)
    expect(fn).toBeCalled()
  })

  it('test blankObject works', () => {
    const obj = blankObject()
    expect(isKeyOf(obj, 'foo')).toBeFalsy()
    expect(Object.keys(obj).length).toBe(0)
    expect(isEmptyObject(obj)).toBeTruthy()
  })

  it('test runAll function', () => {
    const fn1 = vi.fn(noop)
    const fn2 = vi.fn(noop)
    const fns = [fn1, fn2]
    runAll(fns)
    expect(fn1).toBeCalled()
    expect(fn2).toBeCalled()
    runAll(fns)
    expect(fn1).toBeCalledTimes(2)
  })

  it('test runOnce function', () => {
    const fn = vi.fn(noop)
    const once = runOnce(fn)
    run(once)
    expect(fn).toBeCalled()
    run(once)
    expect(fn).toBeCalledTimes(1)
  })

  it('test assert function', () => {
    expect(assert).toBeDefined()
    expect(() => assert(false, 'false')).toThrowError(/false/)
    const res = undefined
    expect(() => assert(res, new Error('false'))).toThrowError(/false/)

    const fn = vi.fn(() => assert(1, new Error('false')))
    fn()
    expect(fn).toBeCalled()
  })

  it('test shallowArrayEqual function', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 3]
    const arr3 = [1, 3, 2]

    expect(shallowArrayEqual(arr1, arr2)).toBeTruthy()
    expect(shallowArrayEqual(arr1, arr3)).toBeFalsy()
  })

  it('test looseArrayEqual function', () => {
    const arr1 = [1, 2, 3]
    const arr2 = [1, 2, 3]
    const arr3 = [1, 3, 2]
    const arr4 = [1, 2, 3, 4]

    expect(looseArrayEqual(arr1, arr2)).toBeTruthy()
    expect(looseArrayEqual(arr1, arr3)).toBeTruthy()
    expect(looseArrayEqual(arr1, arr4)).toBeFalsy()
  })

  it('should createIsomorphicDestructurable works', () => {
    const foo = 'foo'
    const bar = 2

    const obj = { foo, bar }
    const arr = [foo, bar]

    const isomorphic = createIsomorphicDestructurable(obj, arr)

    expect(isomorphic.foo).toBe(foo)
    expect(isomorphic.bar).toBe(bar)

    const [foo1, bar1] = isomorphic
    expect(foo1).toBe(foo)
    expect(bar1).toBe(bar)
  })

  it('should simpleHash works', () => {
    const str = 'bryce'
    expect(simpleHash(str)).toMatchInlineSnapshot('"1jz6tn"')
    expect(simpleHash(str)).toMatchInlineSnapshot('"1jz6tn"')
  })

  it('should salt works', () => {
    const str = 'bryce loskie'
    expect(salt(str)).toMatchInlineSnapshot('"rtfy0c0000000000"')
    expect(salt(str, 32)).toMatchInlineSnapshot('"rtfy0c00000000000000000000000000"')
  })
})
