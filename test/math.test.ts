import { describe, expect, it } from 'vitest'

import { clamp, sum } from '../src/index'

describe('should math module works', () => {
  it('test clamp', () => {
    expect(clamp(2, 3, 6)).toEqual(3)
    expect(clamp(5, 3, 6)).toEqual(5)
  })

  it('test sum', () => {
    expect(sum(2, 3)).toEqual(5)
    expect(sum([2], [2, 3])).toEqual(7)
    expect(sum([2, 2, 3])).toEqual(7)
    // @ts-expect-error ignore
    expect(sum(2, [2, 3])).toEqual(7)
  })
})
