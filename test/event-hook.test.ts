import { createEventHook } from '../src/event-hook'

describe('createEventHook', () => {
  it('it should be defined', () => {
    expect(createEventHook).toBeDefined()
  })

  it('should trigger event', () => {
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
})
