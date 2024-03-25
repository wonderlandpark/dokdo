import { ButtonBuilder, TextBasedChannel, User, Message, InteractionCollector, ButtonInteraction, TimestampStylesString, Snowflake, ChatInputCommandInteraction, Client } from 'discord.js';
import util from 'util';

interface ProcessOptions {
    /**
     * @default 1900
     */
    limit?: number;
    /**
     * @default false
     */
    noCode?: boolean;
    secrets?: string[];
    lang?: string;
}
interface ActionOptions {
    manager: ProcessManager;
    [x: string]: any;
}
interface Action {
    button: ButtonBuilder;
    requirePage: boolean;
    action(options: ActionOptions): Promise<any> | any;
}
/**
 * Process Manager of every Process
 */
declare class ProcessManager {
    content: string;
    dokdo: Dokdo;
    options: ProcessOptions;
    target: TextBasedChannel;
    messageContent: string;
    limit: number;
    splitted: string[];
    page: number;
    author: User;
    actions: Action[];
    wait: number;
    message?: Message;
    argument: never[];
    args: any;
    messageComponentCollector: InteractionCollector<ButtonInteraction> | undefined;
    constructor(message: Context, content: string, dokdo: Dokdo, options?: ProcessOptions);
    init(): Promise<void>;
    addAction(actions: Action[], args?: Record<string, unknown>): Promise<void>;
    createMessageComponentMessage(): Promise<void>;
    filterSecret(string: string): string;
    updatePage(num: number): void;
    nextPage(): void;
    previousPage(): void;
    update(): void;
    edit(): void;
    add(content: string): void;
    destroy(): void;
    genText(): string;
    splitContent(): string[];
}

declare class codeBlock {
    static construct(content: string, lang?: string): string;
    static parse(content: string): string[] | null;
}

declare class HLJS {
    static languages: string[];
    /**
     * Get highlight.js language of given query.
     */
    static getLang(query?: string | null): string | undefined;
}

declare class System {
    /**
     * Get memory info
     *
     * @returns {NodeJS.MemoryUsage}
     */
    static memory(): Partial<NodeJS.MemoryUsage>;
    static processReadyAt(): Date;
}

declare class DateFormatting {
    static _format(date: Date | number, style: TimestampStylesString): string;
    static relative(date: Date | number): string;
}

declare function count(argument: any): {
    name: string;
    count: number;
    ratio: string;
}[] | null;

declare function inspect(value: unknown, options: util.InspectOptions): string;

declare function table(obj: Record<string, any>): string;

declare function typeFind(argument: any): 'NaN' | 'Class' | 'Function' | string;

declare function isInstance(target: unknown, theClass: any): boolean;

declare const isGenerator: (target: Generator) => boolean;

declare function regexpEscape(string: string): string;

declare function join(arr: string[], sep: string, lastSep: string): string;

type index$1_Action = Action;
type index$1_ActionOptions = ActionOptions;
type index$1_DateFormatting = DateFormatting;
declare const index$1_DateFormatting: typeof DateFormatting;
type index$1_HLJS = HLJS;
declare const index$1_HLJS: typeof HLJS;
type index$1_ProcessManager = ProcessManager;
declare const index$1_ProcessManager: typeof ProcessManager;
type index$1_ProcessOptions = ProcessOptions;
type index$1_System = System;
declare const index$1_System: typeof System;
type index$1_codeBlock = codeBlock;
declare const index$1_codeBlock: typeof codeBlock;
declare const index$1_count: typeof count;
declare const index$1_inspect: typeof inspect;
declare const index$1_isGenerator: typeof isGenerator;
declare const index$1_isInstance: typeof isInstance;
declare const index$1_join: typeof join;
declare const index$1_regexpEscape: typeof regexpEscape;
declare const index$1_table: typeof table;
declare const index$1_typeFind: typeof typeFind;
declare namespace index$1 {
  export {
    index$1_Action as Action,
    index$1_ActionOptions as ActionOptions,
    index$1_DateFormatting as DateFormatting,
    index$1_HLJS as HLJS,
    index$1_ProcessManager as ProcessManager,
    index$1_ProcessOptions as ProcessOptions,
    index$1_System as System,
    index$1_codeBlock as codeBlock,
    index$1_count as count,
    index$1_inspect as inspect,
    index$1_isGenerator as isGenerator,
    index$1_isInstance as isInstance,
    index$1_join as join,
    index$1_regexpEscape as regexpEscape,
    index$1_table as table,
    index$1_typeFind as typeFind,
  };
}

declare function main(message: Context, parent: Dokdo): Promise<void>;

declare function exec(message: Message, parent: Dokdo): Promise<void>;

declare function js(message: Context, parent: Dokdo): Promise<void>;

declare function shard(message: Message, parent: Dokdo): Promise<void>;

declare function jsi(message: Message, parent: Dokdo): Promise<void>;

declare function curl(message: Message, parent: Dokdo): Promise<void>;

declare function cat(message: Message, parent: Dokdo): Promise<void>;

declare const index_cat: typeof cat;
declare const index_curl: typeof curl;
declare const index_exec: typeof exec;
declare const index_js: typeof js;
declare const index_jsi: typeof jsi;
declare const index_main: typeof main;
declare const index_shard: typeof shard;
declare namespace index {
  export {
    index_cat as cat,
    index_curl as curl,
    index_exec as exec,
    index_js as js,
    index_jsi as jsi,
    index_main as main,
    index_shard as shard,
  };
}

interface DokdoOptions {
    aliases?: string[];
    owners?: Snowflake[];
    prefix?: string;
    secrets?: string[];
    globalVariable?: Record<string, any>;
    disableAttachmentExecution?: boolean;
    noPerm?(context: Message | ChatInputCommandInteraction): Promise<unknown>;
    isOwner?: (user: User) => boolean | Promise<boolean>;
}
interface MessageData {
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
type Context = ChatInputCommandInteraction | Message;
declare class Dokdo {
    client: Client;
    options: DokdoOptions;
    owners: Snowflake[];
    process: never[];
    /**
     * Main Client of Dokdo
     * @param client Discord Client
     * @param options Dokdo Options
     */
    constructor(client: Client, options: DokdoOptions);
    run(ctx: Context): Promise<void>;
    _addOwner(id: Snowflake): Snowflake[];
    _removeOwner(id: Snowflake): Snowflake[];
}

export { Dokdo as Client, index as Commands, Context, DokdoOptions, MessageData, index$1 as Utils };
