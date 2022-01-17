import type { Fn } from './types'

export const sleep = (ms: number, callback?: Fn) => {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(() => {
      callback?.()
      clearTimeout(timer)
      resolve()
    }, ms)
  })
}
