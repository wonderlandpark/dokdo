import { Snowflake, Client, Message, User } from 'discord.js'

/**
 * @typedef MessageData
 * @property {string} [raw] Raw message content
 * @property {string} [cmd] Command
 * @property {string} [type] Command type
 * @property {string} [args] Arguments given
 */

export interface DokdoOptions {
  aliases?: string[]
  owners?: Snowflake[]
  prefix?: string
  secrets?: any[]
  globalVariable?: Record<string, any>
  noPerm?(message: Message): Promise<any>
  disableAttachmentExecution?: boolean
  isOwner?: (user: User) => boolean | Promise<boolean>
}

export interface MessageData {
  raw: string
  command: string
  type: string
  args: string
}

export class Dokdo {
  public owners: Snowflake[]
  public process: never[]

  public constructor(public client: Client, public options: DokdoOptions) {
    if (!(client instanceof Client))
      throw new TypeError('Invalid `client`. `client` parameter is required.')

    if (typeof options.noPerm !== 'function')
      throw new Error('`noPerm` parameter must be Function.')

    if (options.globalVariable) {
      if (typeof options.globalVariable !== 'object')
        throw new Error('`globalVariable` parameter must be Object.')
      else {
        Object.keys(options.globalVariable).forEach((el) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (options.globalVariable) global[el] = options.globalVariable[el]
        })
      }
    }

    if (options.isOwner && !options.owners) options.owners = []
    this.owners = options.owners || []

    if (!this.options.secrets || !Array.isArray(this.options.secrets))
      this.options.secrets = []

    if (!this.options.aliases) this.options.aliases = ['dokdo', 'dok']

    this.process = []

    client.once('ready', (client) => {
      if (!this.owners) {
        console.warn('[ Dokdo ] Owners not given. Fetching from Application.')
        client.application.fetch().then((data) => {
          if (!data.owner)
            return console.warn('[ Dokdo ] Falied to owner data.')
          if (data.owner instanceof User) return this.owners.push(data.owner.id)

          this.owners = data.owner.members?.map((el) => el.id)

          console.info(
            `[ Dokdo ] Fetched ${this.owners.length} owner(s): ${
              this.owners.length > 3
                ? this.owners.slice(0, 3).join(', ') +
                  ` and ${this.owners.length - 3} more owners`
                : this.owners.join(', ')
            }`
          )
        })
      }
    })
  }

  public _addOwner(id: Snowflake) {
    if (this.owners.includes(id)) return
    this.owners.push(id)
    return this.owners
  }

  public _removeOwner(id: Snowflake) {
    if (!this.owners.includes(id)) return null
    this.owners.splice(this.owners.indexOf(id), 1)
    return this.owners
  }
}
