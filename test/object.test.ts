import { describe, expect, it } from 'vitest'
import { getDeep, objectOmit, objectPick, traverse } from '../src'

describe('test object module', () => {
  it('test objectOmit function', () => {
    const target = { name: 'bryce', age: 25, size: '20cm' }
    const res = objectOmit(target, 'name')
    expect(Object.keys(res)).toEqual(['age', 'size'])
    expect(objectOmit(target, ['name', 'age'])).toEqual({ size: '20cm' })
  })

  it('test getDeep function', () => {
    const obj = { name: 'bryce', age: 25, size: '20cm', foo: { bar: 'baz' } }
    const res = getDeep(obj, 'foo.bar')
    expect(res).toEqual('baz')
    expect(getDeep(obj, 'foo.bar.baz')).toEqual(undefined)
  })

  it('test objectPick function', () => {
    const target = { name: 'bryce', age: 25, size: '20cm', foo: undefined }
    const res = objectPick(target, ['name', 'age'])
    expect(res).toEqual({ name: 'bryce', age: 25, foo: undefined })
    expect(objectPick(target, ['name', 'age'], true)).toEqual({ name: 'bryce', age: 25 })
  })

  it('test traverse function', () => {
    const target = { name: 'bryce', foo: { bar: 'baz' } }
    traverse(target, {
      'foo.bar': (target, index, obj) => {
        expect(target).toEqual('baz')
        expect(index).toEqual(0)
        expect(obj).toEqual({ name: 'bryce', foo: { bar: 'baz' } })
      },
    })

    // change value
    traverse(target, {
      foo(target) {
        target.bar = 'bazbaz'
      },
    })

    expect(target).toEqual({ name: 'bryce', foo: { bar: 'bazbaz' } })
  })
})
