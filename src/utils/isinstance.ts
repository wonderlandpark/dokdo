import { Collection } from 'discord.js'

export function isInstance (target: unknown, theClass: any): boolean {
  if (
    target instanceof Collection &&
    target.map((f) => f instanceof theClass).includes(false)
  ) { return false } else if (
    Array.isArray(target) &&
    target.map((f) => f instanceof theClass).includes(false)
  ) { return false } else if (!(target instanceof theClass)) return false
  else return true
}
