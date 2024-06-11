export function jsonEncode(obj: any, options?: { prettier?: boolean }) {
  const { prettier } = options ?? {}
  try {
    return prettier ? JSON.stringify(obj, undefined, 4) : JSON.stringify(obj)
  }
  catch (error) {
    return undefined
  }
}

export function jsonDecode(json: string | null | undefined) {
  if (json === undefined)
    return undefined
  try {
    return JSON.parse(json!)
  }
  catch (error) {
    return undefined
  }
}
