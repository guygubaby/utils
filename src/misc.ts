/**
 * nano uuid generator
 * @returns uuid string
 */
export const uuid = (): string => {
  return Array.from({ length: 16 }, () => Math.trunc(Math.random() * 256).toString(16).padStart(2, '0')).join('')
}

/**
 * judge condition whether is `true` or throw error
 * @param condition judge condition
 * @param message if condition not `true` will throw this as error message
 */
export const assert = (condition: boolean, message: string): asserts condition => {
  if (!condition) throw new Error(message)
}

export const toString = (v: any) => Object.prototype.toString.call(v)

/**
 * Do nothing
 */
export const noop = () => {}

export const timestamp = (): number => Date.now()
