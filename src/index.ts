import {
  Snowflake,
  Client,
  Message,
  User,
  ChatInputCommandInteraction
} from 'discord.js'
import fetch from 'node-fetch'

import * as Utils from './utils'
import * as Commands from './commands'
import { cat, curl, exec, js, jsi, main, shard } from './commands'

export interface DokdoOptions {
  aliases?: string[];
  owners?: Snowflake[];
  prefix?: string;
  secrets?: string[];
  globalVariable?: Record<string, any>;
  disableAttachmentExecution?: boolean;
  noPerm?(context: Message | ChatInputCommandInteraction): Promise<unknown>;
  isOwner?: (user: User) => boolean | Promise<boolean>;
}
export interface MessageData {
  raw: string;
  command: string;
  type: string;
  args?: string;
}
declare module 'discord.js' {
  interface Message {
    data: MessageData;
  }
}

export type Context = ChatInputCommandInteraction | Message;

class Dokdo {
  public owners: Snowflake[];
  public process: never[];

  /**
   * Main Client of Dokdo
   * @param client Discord Client
   * @param options Dokdo Options
   */
  public constructor (public client: Client, public options: DokdoOptions) {
    if (!(client instanceof Client)) { throw new TypeError('Invalid `client`. `client` parameter is required.') }

    // if (!this.options || typeof options !== 'object') throw new Error('Invliad `options`. `options` parameter is required.')

    if (options.noPerm && typeof options.noPerm !== 'function') { throw new Error('`noPerm` parameter must be Function.') }

    if (options.globalVariable) {
      if (typeof options.globalVariable !== 'object') { throw new Error('`globalVariable` parameter must be Object.') } else {
        Object.keys(options.globalVariable).forEach((el) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (options.globalVariable) global[el] = options.globalVariable[el]
        })
      }
    }

    if (options.isOwner && !options.owners) options.owners = []
    this.owners = options.owners || []

    if (!this.options.secrets || !Array.isArray(this.options.secrets)) { this.options.secrets = [] }

    if (!this.options.aliases) this.options.aliases = ['dokdo', 'dok']

    this.process = []

    client.once('ready', (client) => {
      if (!this.owners.length) {
        console.warn('[ Dokdo ] Owners not given. Fetching from Application.')
        client.application.fetch().then((data) => {
          if (!data.owner) { return console.warn('[ Dokdo ] Falied to owner data.') }
          if (data.owner instanceof User) { return this.owners.push(data.owner.id) }

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

  public async run (ctx: Context): Promise<void> {
    if (ctx instanceof Message) {
      if (!this.options.prefix) return
      if (!ctx.content.startsWith(this.options.prefix)) return

      const parsed = ctx.content.replace(this.options.prefix, '').split(' ')
      const codeParsed = Utils.codeBlock.parse(parsed.slice(2).join(' '))

      ctx.data = {
        raw: ctx.content,
        command: parsed[0]!,
        type: parsed[1]!,
        args: codeParsed ? codeParsed[2] : parsed.slice(2).join(' ')
      }

      if (
        !ctx.data.args &&
        ctx.attachments.size > 0 &&
        !this.options.disableAttachmentExecution
      ) {
        const file = ctx.attachments.first()
        if (!file) return

        const buffer = await (await fetch(file.url)).buffer()
        const type = { ext: file.name?.split('.').pop(), fileName: file.name }

        if (
          ['txt', 'js', 'ts', 'sh', 'bash', 'zsh', 'ps'].includes(type.ext!)
        ) {
          ctx.data.args = buffer.toString()
          if (!ctx.data.type && type.ext !== 'txt') ctx.data.type = type.ext!
        }
      }
      if (
        this.options.aliases &&
        !this.options.aliases.includes(ctx.data.command)
      ) { return }
      if (!this.owners.includes(ctx.author.id)) {
        let isOwner = false

        if (this.options.isOwner) {
          isOwner = await this.options.isOwner(ctx.author)
        }

        if (!isOwner) {
          if (this.options.noPerm) this.options.noPerm(ctx)
          return
        }
      }

      if (!ctx.data.type) return main(ctx, this)
      switch (ctx.data.type) {
        case 'sh':
        case 'bash':
        case 'ps':
        case 'powershell':
        case 'shell':
        case 'zsh':
        case 'exec':
          exec(ctx, this)
          break
        case 'js':
        case 'javascript':
          js(ctx, this)
          break
        case 'shard':
          shard(ctx, this)
          break
        case 'jsi':
          jsi(ctx, this)
          break
        case 'curl':
          curl(ctx, this)
          break
        case 'cat':
          cat(ctx, this)
          break
        default:
          ctx.reply(
            `Available Options: ${Object.keys(Commands)
              .filter((t) => t !== 'main')
              .map((t) => `\`${t}\``)
              .join(', ')}`
          )
      }
    }
  }

  public _addOwner (id: Snowflake): Snowflake[] {
    if (!this.owners.includes(id)) this.owners.push(id)
    return this.owners
  }

  public _removeOwner (id: Snowflake): Snowflake[] {
    if (this.owners.includes(id)) this.owners.splice(this.owners.indexOf(id), 1)
    return this.owners
  }
}

export { Dokdo as Client, Utils, Commands }
