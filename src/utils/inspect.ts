import util from 'util'

export function inspect (value: string, options: util.InspectOptions): string {
  return util.inspect(value, options)
}
