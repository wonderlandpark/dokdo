import util from 'util'

export function inspect (value: unknown, options: util.InspectOptions): string {
  return util.inspect(value, options)
}
