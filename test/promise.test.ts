import { to } from '../src'

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
})
