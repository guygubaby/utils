import { describe, expect, it } from 'vitest'
import { getDeep, objectOmit } from '../src'

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
})
