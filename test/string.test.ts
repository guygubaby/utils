import { describe, expect, it } from 'vitest'

import { ensurePrefix, slash } from './../src/string'

describe('test string module', () => {
  it('test slash method', () => {
    const str = '\\foo\\bar.txt'
    expect(slash(str)).toEqual('/foo/bar.txt')
  })

  it('test ensurePrefix method', () => {
    const str = 'test.txt'
    expect(ensurePrefix(str, 'prefix/')).toEqual('prefix/test.txt')
    expect(ensurePrefix(`prefix/${str}`, 'prefix/')).toEqual('prefix/test.txt')
  })
})
