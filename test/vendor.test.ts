import { describe, expect, it } from 'vitest'
import { customAlphabet, nanoid } from '../src'

describe('expect vendor works', () => {
  it('should nanoid defined', () => {
    expect(nanoid).toBeDefined()
  })

  it('should nanoid works', () => {
    const uid = nanoid()
    expect(uid).toBeDefined()
    expect(uid.length).toBe(21)
    const uid1 = nanoid()
    expect(uid1).toBeDefined()
    expect(uid1.length).toBe(21)
    expect(uid).not.toBe(uid1)
  })

  it('should customAlphabet works', () => {
    const _nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 5)
    const uid = _nanoid(10)
    expect(uid).toBeDefined()
    expect(uid.length).toBe(10)
  })
})
