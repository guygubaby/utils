import { objectOmit } from '../src'

describe('test object module', () => {
  it('test objectOmit function', () => {
    const target = { name: 'bryce', age: 25, size: '20cm' }
    const res = objectOmit(target, ['name'])
    expect(Object.keys(res)).toEqual(['age', 'size'])
  })
})
