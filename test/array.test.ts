
import { at, clampArrayRange, flattenArrayable, last, mergeArrayable, move, partition, range, rangeWithStart, toArray } from '../src/array'

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

  it('should move works', () => {
    expect(move([1, 2, 3], 1, 2)).toEqual([1, 3, 2])
  })

  it('should range works', () => {
    expect(range(0)).toEqual([])
    expect(range(4)).toEqual([0, 1, 2, 3])
  })

  it('should rangeWithStart works', () => {
    expect(rangeWithStart(4, 6)).toEqual([4, 5])
  })

  it('should partiction works', () => {
    const arr = range(10)
    expect(partition([1, 2, 3], val => val % 2 === 0)).toEqual([[2], [1, 3]])
    expect(partition([], val => val % 2 === 0)).toEqual([[], []])
    expect(partition(arr, val => val % 2 === 0, val => val % 2 === 1)).toHaveLength(3)

    expect(
      partition(
        arr,
        i => i % 3 === 0,
        i => i % 2 === 0,
      ),
    ).toEqual([
      [0, 3, 6, 9],
      [2, 4, 8],
      [1, 5, 7],
    ])
  })
})
