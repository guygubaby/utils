
import { at, clampArrayRange, flattenArrayable, last, mergeArrayable, toArray } from '../src/array'

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

  it('should at function works', () => {
    expect(at([1, 2, 3], -1)).toEqual(3)
    expect(at([1, 2, 3], 1)).toEqual(2)
    expect(at([], 1)).toEqual(undefined)
  })

  it('should clampArrayRange function works', () => {
    expect(clampArrayRange(-1, [1, 2, 3])).toEqual(0)
    expect(clampArrayRange(1, [1, 2, 3])).toEqual(1)
    expect(clampArrayRange(10, [1, 2, 3])).toEqual(2)
  })

  it('should last function works', () => {
    expect(last([1, 2, 3])).toEqual(3)
    expect(last([])).toEqual(undefined)
    expect(last([1])).toEqual(1)
  })

  it('should mergeArrayable function works', () => {
    expect(mergeArrayable([1, 2, 3], [4, 5, 6], 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })
})
