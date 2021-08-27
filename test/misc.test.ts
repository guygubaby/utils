import { uuid } from '../src/misc'

describe('should misc module works', () => {
  it('test uuid', () => {
    expect(uuid().length).toBe(32)
  })
})
