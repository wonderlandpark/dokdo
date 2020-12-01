declare module 'dokdo' {
  import Discord, { Message } from 'discord.js'
  export default Dokdo

  class Dokdo {
    constructor(client: Discord.Client, options: DokdoOptions)
    public client: Discord.Client
    public Discord: Discord
    public options: DokdoOptions
    public run(message: Message): Promise<any>
  }

  interface DokdoOptions {
    aliases?: string[]
    owners?: string[]
    prefix?: string
    secrets?: any[]
    noPerm(message: Message): any|Promise<any>
  }

  export class ProcessManager {
    constructor(message: Discord.Message, content: string, dokdo: Dokdo, options: ProcessOptions)
    public target: Discord.TextChannel
    public dokdo: Dokdo
    public content: string
    public messageContent: string
    public limit: number
    public splitted: string[]
    public page: number
    public author: Discord.User
    public actions: Action[]
    public options: ProcessOptions
  }

  interface ProcessOptions {
    limit?: number
    noCode?: boolean
    secrets?: any[]
    lang?: string
  }

  interface Action {
    emoji: string
    requirePage: boolean

    action({ manager: Dokdo, ...args: any }): any|Promise<any> 
  }
}