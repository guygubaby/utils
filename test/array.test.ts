
import { flattenArrayable, toArray } from '../src/array'

describe('Test math module', () => {
  it('should toArray works', () => {
    expect(toArray([1, 2, 3])).toEqual([1, 2, 3])
    expect(toArray(1)).toEqual([1])
  })

  it('should flatten array like works', () => {
    expect(flattenArrayable([1, 2, 3])).toEqual([1, 2, 3])
    expect(flattenArrayable([1, 2, [3]])).toEqual([1, 2, 3])
    expect(flattenArrayable([1, '2', [3]])).toEqual([1, '2', 3])
  })
})
