import { isBrowser, isWindow } from '../is'

export interface GeneralEventListener<E = Event> {
  (evt: E): void
}

export type EventKeys = keyof HTMLElementEventMap

export type EventTarget = Node | Window

export const off = <EventType = Event>(
  target: EventTarget,
  event: EventKeys,
  handler: GeneralEventListener<EventType>,
) => {
  target.removeEventListener(event, handler as any, false)
}

export const on = <EventType = Event>(
  target: EventTarget,
  event: EventKeys,
  handler: GeneralEventListener<EventType>,
) => {
  target.addEventListener(event, handler as any, false)
  return () => off(target, event, handler as any)
}

export const once = <EventType = Event>(
  target: EventTarget,
  event: EventKeys,
  handler: GeneralEventListener<EventType>,
) => {
  const _handler = (e: Event) => {
    handler(e as any)
    off(target, event, _handler)
  }

  on(target, event, _handler)
}

export type ScrollTarget = HTMLElement | Window | Document

const isInsideBrowser = isBrowser()

export function getScrollOffset(
  target: ScrollTarget,
  isLeft?: boolean,
): number {
  if (!isInsideBrowser || !target)
    return 0

  const method = isLeft ? 'scrollLeft' : 'scrollTop'
  let result = 0
  if (isWindow(target))
    result = (target as Window)[isLeft ? 'pageXOffset' : 'pageYOffset']

  else if (target instanceof Document)
    result = target.documentElement[method]

  else if (target)
    result = (target as HTMLElement)[method]

  return result
}

/**
 * Raw raf
 */
export const raf = (fn: FrameRequestCallback) => {
  if (!isInsideBrowser) return -1
  return requestAnimationFrame(fn)
}

/**
 * Use raf to throttle a function
 */
export const rafThrottleFn = (fn: Function) => {
  let pending = false
  return function(...args: any[]) {
    if (pending) return
    pending = true
    raf(() => {
      pending = false
      fn(...args)
    })
  }
}

/**
 * Raw cancel raf
 */
export const cancelRaf = (id: number) => {
  isInsideBrowser && cancelAnimationFrame(id)
}

/**
 * run fn using raf and dispose automatically
 * @param fn function to run
 * @returns raf id
 */
export const pureRaf = (fn: FrameRequestCallback) => {
  if (!isInsideBrowser) return -1
  const id = raf((ts) => {
    fn(ts)
    cancelRaf(id)
  })
  return id
}

/**
 * run fn in next frame
 * @param fn
 */
export const nextFrame = (fn: FrameRequestCallback) => {
  pureRaf(() => pureRaf(fn))
}

export {
  checkWebpFeature,
} from './webp'
