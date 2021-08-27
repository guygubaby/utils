/**
 * nano uuid generator
 * @returns uuid string
 */
export const uuid = (): string => {
  return Array.from({ length: 16 }, () => Math.trunc(Math.random() * 256).toString(16).padStart(2, '0')).join('')
}
