export type PartialFunctions<T> = ((val: T, index: number, array: readonly T[]) => boolean)[]

export type ItemGenerator<T> = (v: unknown, k: number) => T

/**
 * Function
 */
export type Fn = () => void

/**
 * Array, or not yet
 */
export type Arrayable<T> = T | Array<T>

/**
 * Null or whatever
 */
export type Nullable<T> = T | null

/**
 * Promise, or maybe not
 */
export type Awaitable<T> = PromiseLike<T> | T

/**
 * Infers the element type of an array
 */
export type ElementOf<T> = T extends (infer U)[] ? U : never

/**
 * Infers the arguments type of a function
 */
export type ArgumentsType<T> = T extends ((...args: infer A) => any) ? A : never
