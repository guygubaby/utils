import { describe, expect, it } from 'vitest'
import { at, clampArrayRange, fillWith, flattenArrayable, last, mergeArrayable, move, partition, range, rangeWithStart, remove, sample, shuffle, toArray, uniq, uniqBy } from '../src/array'

describe('test math module', () => {
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

  it('test fillWith works', () => {
    const data = range(10)
    expect(fillWith(2, 1)).toEqual([1, 1])
    expect(fillWith<number>(10, (v, K) => K)).toEqual(data)
  })

  it('test remove works', () => {
    const data = range(10)
    expect(remove(data, 0)).toBeTruthy()
    expect(data).toEqual(rangeWithStart(1, 10))
    expect(remove(data, -1)).toBeFalsy()
  })

  it('test uniq works', () => {
    const data = fillWith(10, 2)
    expect(uniq(data)).toEqual([2])
  })

  it('should uniqBy works', () => {
    const arr1 = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const arr2 = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 1 }]

    expect(uniqBy(arr2, 'id')).toEqual(arr1)
    expect(uniqBy(arr2, (prev, cur) => prev.id === cur.id)).toEqual(arr1)

    const arr3 = [0, 1, 2, 0, 0]
    expect(uniqBy(arr3, (prev, cur) => prev === cur)).toEqual([0, 1, 2])
  })

  it('should sample works', () => {
    const arr = range(10)
    const sampleArr = sample(arr, 5)
    expect(sampleArr).toHaveLength(5)
    expect(sampleArr.every(v => arr.includes(v))).toBeTruthy()
  })

  it('should shuffle works', () => {
    const arr = range(10)
    const shuffleArr = shuffle(arr)
    expect(shuffleArr).toHaveLength(10)
    expect(shuffleArr.every(v => arr.includes(v))).toBeTruthy()
  })
})
