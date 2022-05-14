import { describe, expect, it, vi } from 'vitest'

import { createSingletonPromise, lastPromiseFn, lockPromsieFn, sleep, to } from '../src'

describe('test promises', () => {
  it('should to defined', () => {
    expect(to).toBeDefined()
  })

  it('should to works', async() => {
    const p = Promise.resolve(1)
    const [err, res] = await to(p)
    expect(err).toBeNull()
    expect(res).toBe(1)
  })

  it('should lockPromsieFn defined', () => {
    expect(lockPromsieFn).toBeDefined()
  })

  it('should lockPromsieFn works', async() => {
    const fn = vi.fn((num: number) => Promise.resolve(num))
    const lockFn = lockPromsieFn(fn)
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

  it('should lastPromiseFn works', async() => {
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

  it('should sleep works', async() => {
    const fn = vi.fn()
    await sleep(100).then(fn)
    expect(fn).toHaveBeenCalledTimes(1)
    await sleep(100, fn)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should createSingletonPromise works', async() => {
    let dummy = 0

    const fn = vi.fn(async() => {
      await sleep(10)
      dummy += 1
      return dummy
    })

    const promise = createSingletonPromise(fn)
    expect(dummy).toBe(0)
    expect(fn).toBeCalledTimes(0)

    await promise()
    expect(fn).toBeCalledTimes(1)
    expect(dummy).toBe(1)

    // call wrapper again, but not call fn again, because it's staled
    await promise()
    expect(fn).toBeCalledTimes(1)
    expect(await promise()).toBe(1)
    expect(fn).toBeCalledTimes(1)
    expect(dummy).toBe(1)

    // reset staled promise, make it can be called again
    await promise.reset()
    // call wrapper again, and call fn again
    await promise()
    expect(fn).toBeCalledTimes(2)
    expect(dummy).toBe(2)
  })
})
