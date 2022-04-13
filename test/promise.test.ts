import { describe, expect, it, vi } from 'vitest'

import { lastPromiseFn, lockPromsieFn, to } from '../src'

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
})
