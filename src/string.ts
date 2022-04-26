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
