/**
 * replace backslash to slash
 */
export const slash = (str: string): string => {
  return str.replace(/\\/g, '/')
}

/**
 * Ensure prefix of a string
 */
export const ensurePrefix = (str: string, prefix: string): string => {
  if (!str.startsWith(prefix))
    return prefix + str
  return str
}

/**
 * Ensure suffix of a string
 */
export const ensureSuffix = (str: string, suffix: string): string => {
  if (!str.endsWith(suffix))
    return str + suffix
  return str
}

// port from nanoid
// https://github.com/ai/nanoid
const urlAlphabet = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'
/**
 * Generate a random string
 * @category String
 */
export function randomStr(size = 16, dict = urlAlphabet) {
  let id = ''
  let i = size
  const len = dict.length
  while (i--)
    id += dict[(Math.random() * len) | 0]
  return id
}

/**
 * First letter uppercase, other lowercase
 * @category string
 * @example
 * ```
 * capitalize('hello') => 'Hello'
 * capitalize('hELLO') => 'Hello'
 * ```
 */
export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1).toLowerCase()
}
