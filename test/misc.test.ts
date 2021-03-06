import { describe, expect, it, vi } from 'vitest'
import { assert, blankObject, noop, run, runAll, runOnce, timestamp, uuid } from '../src/misc'
import { isKeyOf } from '../src'
import { isEmptyObject } from '../src/is'

describe('should misc module works', () => {
  it('test uuid', () => {
    expect(uuid().length).toBe(32)
  })

  it('test timestamp works', () => {
    expect(timestamp()).toBe(Date.now())
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
})
