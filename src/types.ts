/**
 * Array, or not yet
 */
export type Arrayable<T> = T | Array<T>

/**
 * Null or whatever
 */
export type Nullable<T> = T | null | undefined

export type PartialFunctions<T> = ((val: T, index: number, array: readonly T[]) => boolean)[]

export type ItemGenerator<T> = (v: unknown, k: number) => T
