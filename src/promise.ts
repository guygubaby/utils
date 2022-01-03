import type { Fn } from './types'

export const sleep = (ms: number, callback?: Fn<void>) => {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(async() => {
      await callback?.()
      clearTimeout(timer)
      resolve()
    }, ms)
  })
}
