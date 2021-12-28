import { isWindow } from './is'

export type GeneralEventListener<E = Event> = {
  (evt: E): void
}

export type EventKeys = keyof HTMLElementEventMap

type EventTarget = Node | Window

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

export function getScrollOffset(
  target: ScrollTarget,
  isLeft?: boolean,
): number {
  if (typeof window === 'undefined' || !target)
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
