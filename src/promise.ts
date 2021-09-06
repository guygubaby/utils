import { Fn } from './types'

export const sleep = (ms: number, callback?: Fn<void>) => {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(async() => {
      await callback?.()
      window.clearTimeout(timer)
      resolve()
    }, ms)
  })
}
