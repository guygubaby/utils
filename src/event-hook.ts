/**
 * The source code for this function was inspired by vue-apollo's `useEventHook` util
 * https://github.com/vuejs/vue-apollo/blob/v4/packages/vue-apollo-composable/src/util/useEventHook.ts
 */

export type EventHookOn<T = any> = (fn: (param: T) => void) => { off: () => void }
export type EventHookOff<T = any> = (fn: (param: T) => void) => void
export type EventHookTrigger<T = any> = (param: T) => void

export interface EventHook<T = any> {
  on: EventHookOn<T>
  off: EventHookOff<T>
  trigger: EventHookTrigger<T>
}

/**
  * Utility for creating event hooks
  *
  * Example:
  *
  * ```typescript
  *   it('should trigger event', () => {
        const myFunction = () => {
          const hook = createEventHook<string>()
          const trigger = (payload: string) => hook.trigger(payload)
          return {
            trigger,
            onResult: hook.on,
          }
        }

        let msg = ''

        const { trigger, onResult } = myFunction()
        const { off } = onResult(param => msg = param)

        trigger('hello world')
        expect(msg).toBe('hello world')

        off()

        trigger('foo bar')
        expect(msg).toBe('hello world')
      })
*
* ```
*/
export function createEventHook<T = any>(): EventHook<T> {
  const fns: Array<(param: T) => void> = []

  const off = (fn: (param: T) => void) => {
    const index = fns.indexOf(fn)
    if (index !== -1)
      fns.splice(index, 1)
  }

  const on = (fn: (param: T) => void) => {
    fns.push(fn)

    return {
      off: () => off(fn),
    }
  }

  const trigger = (param: T) => {
    fns.forEach(fn => fn(param))
  }

  return {
    on,
    off,
    trigger,
  }
}
