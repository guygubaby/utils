import { memorize, memorizePromise } from '../src/memorize'

describe('test memorize module', () => {
  it('should memorize works', () => {
    const fn = jest.fn(() => 1)
    const memorizeFn = memorize(fn)
    expect(memorizeFn()).toEqual(1)
    expect(memorizeFn()).toEqual(1)
    expect(memorizeFn()).toEqual(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should memorizePromise works', async() => {
    const fn = jest.fn(() => Promise.resolve(1))
    const memorizeFn = memorizePromise(fn)
    await expect(memorizeFn()).resolves.toEqual(1)
    await expect(memorizeFn()).resolves.toEqual(1)
    await expect(memorizeFn()).resolves.toEqual(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
