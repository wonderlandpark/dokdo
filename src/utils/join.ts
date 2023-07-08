export function join (arr: string[], sep: string, lastSep: string): string {
  if (arr.length <= 1) return arr.join(sep)
  return arr.reduce((text, cur, idx) =>
    [text, cur].join(idx === arr.length - 1 ? lastSep : sep)
  )
}
