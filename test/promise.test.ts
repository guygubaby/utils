import { describe, expect, it, vi } from 'vitest'
import { lastPromiseFn, lockPromiseFn, noop, singletonPromiseFn, sleep, to } from '../src'

describe('test promises', () => {
  it('should to defined', () => {
    expect(to).toBeDefined()
  })

  it('should to works', async () => {
    const p = Promise.resolve(1)
    const [err, res] = await to(p)
    expect(err).toBeNull()
    expect(res).toBe(1)
  })

  it('should lockPromiseFn defined', () => {
    expect(lockPromiseFn).toBeDefined()
  })

  it('should lockPromiseFn works', async () => {
    const fn = vi.fn((num: number) => Promise.resolve(num))
    const lockFn = lockPromiseFn(fn)
    const ret = lockFn(1)
    const ret1 = lockFn(2)
    lockFn(3)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(await ret).toEqual(1)
    expect(await ret1).toBeUndefined()
  })

  it('should lastPromiseFn defined', () => {
    expect(lastPromiseFn).toBeDefined()
  })

  it('should lastPromiseFn works', async () => {
    const fn = vi.fn((num: number) => Promise.resolve(num))
    const lastFn = lastPromiseFn(fn)
    const ret1 = lastFn(1)
    const ret2 = lastFn(2)
    const ret3 = lastFn(3)
    expect(fn).toBeCalledTimes(3)
    expect(ret1).resolves.toEqual(3)
    expect(ret2).resolves.toEqual(3)
    expect(ret3).resolves.toEqual(3)
  })

  it('should sleep works', async () => {
    const fn = vi.fn()
    await sleep(100).then(fn)
    expect(fn).toHaveBeenCalledTimes(1)
    await sleep(100, fn)
    expect(fn).toHaveBeenCalledTimes(2)

    const delayFn = sleep(100, fn)
    delayFn.clear() // cancel run fn
    await delayFn
    expect(fn).toHaveBeenCalledTimes(2)
    expect(delayFn.clear).toBeDefined()
    expect(delayFn).resolves.toBeUndefined()

    const modifyClear = () => {
      delayFn.clear = noop
    }
    expect(modifyClear).toThrowErrorMatchingInlineSnapshot('"Cannot assign to read only property \'clear\' of object \'#<Promise>\'"')
  })

  it('should singletonPromiseFn works', async () => {
    let dummy = 0

    const fn = vi.fn(async () => {
      await sleep(10)
      dummy += 1
      return dummy
    })

    const promise = singletonPromiseFn(fn)
    expect(dummy).toBe(0)
    expect(fn).toBeCalledTimes(0)

    const res = await promise()
    expect(res).toBe(1)
    expect(fn).toBeCalledTimes(1)
    expect(dummy).toBe(1)

    // call wrapper again, but not call fn again, because it's staled
    const res1 = await promise()
    expect(res1).toBe(1)
    expect(fn).toBeCalledTimes(1)
    expect(await promise()).toBe(1)
    expect(fn).toBeCalledTimes(1)
    expect(dummy).toBe(1)

    // reset staled promise, make it can be called again
    await promise.reset()
    // call wrapper again, and call fn again
    const res2 = await promise()
    expect(res2).toBe(2)
    expect(fn).toBeCalledTimes(2)
    expect(dummy).toBe(2)
  })
})
