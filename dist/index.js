"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Client: () => Dokdo,
  Commands: () => commands_exports,
  Utils: () => utils_exports
});
module.exports = __toCommonJS(src_exports);
var import_discord11 = require("discord.js");
var import_node_fetch2 = __toESM(require("node-fetch"));

// src/utils/index.ts
var utils_exports = {};
__export(utils_exports, {
  DateFormatting: () => DateFormatting,
  HLJS: () => HLJS,
  ProcessManager: () => ProcessManager,
  System: () => System,
  codeBlock: () => codeBlock,
  count: () => count,
  inspect: () => inspect,
  isGenerator: () => isGenerator,
  isInstance: () => isInstance,
  join: () => join,
  regexpEscape: () => regexpEscape,
  table: () => table,
  typeFind: () => typeFind
});

// src/utils/ProcessManager.ts
var import_discord = __toESM(require("discord.js"));
var ProcessManager = class {
  constructor(message2, content, dokdo, options = {}) {
    this.content = content;
    this.dokdo = dokdo;
    this.options = options;
    this.target = message2.channel;
    this.dokdo = dokdo;
    this.content = content || "\u200B";
    this.messageContent = "";
    this.options = options;
    this.limit = options.limit || 1900;
    this.splitted = this.splitContent() || [" "];
    this.page = 1;
    this.author = message2 instanceof import_discord.Message ? message2.author : message2.user;
    this.actions = [];
    this.wait = 1;
    this.message = void 0;
    this.argument = [];
    if (typeof this.content !== "string") {
      throw new Error("Please pass valid content");
    }
  }
  target;
  messageContent;
  limit;
  splitted;
  page;
  author;
  actions;
  wait;
  message;
  argument;
  args;
  messageComponentCollector;
  async init() {
    this.messageContent = this.genText();
    this.message = await this.target.send(
      this.filterSecret(this.messageContent)
    );
  }
  async addAction(actions, args) {
    if (!this.message)
      return;
    this.actions.push(...actions);
    this.args = args || {};
    this.args.manager = this;
    this.createMessageComponentMessage();
    this.messageComponentCollector = this.message.createMessageComponentCollector({
      componentType: import_discord.ComponentType.Button,
      filter: (interaction) => Boolean(
        this.actions.find(
          // @ts-ignore
          (e) => e.button.data.custom_id === interaction.customId
        ) && interaction.user.id === this.author.id
      ),
      time: 3e5,
      dispose: true
    });
    this.messageComponentCollector.on("collect", (component) => {
      const event = this.actions.find(
        // @ts-ignore
        (e) => e.button.data.custom_id === component.customId
      );
      if (!event)
        return;
      component.deferUpdate();
      event.action(this.args);
    });
    this.messageComponentCollector.on("end", () => {
      this.message?.edit({ components: [] });
    });
  }
  async createMessageComponentMessage() {
    if (this.options.noCode && this.splitted.length < 2)
      return;
    const buttons = this.actions.filter((el) => !(el.requirePage && this.splitted.length <= 1)).map((el) => el.button);
    if (buttons.length <= 0)
      return;
    const actionRow = new import_discord.default.ActionRowBuilder({
      components: buttons
    });
    this.message?.edit({ components: [actionRow] });
  }
  filterSecret(string) {
    string = string.replace(
      new RegExp(this.dokdo.client.token, "gi"),
      "[accesstoken was hidden]"
    );
    if (this.dokdo.options.secrets) {
      for (const el of this.dokdo.options.secrets) {
        string = string.replace(new RegExp(regexpEscape(el), "gi"), "[secret]");
      }
    }
    return string;
  }
  updatePage(num) {
    if (!this.message)
      return;
    if (this.splitted.length < num || num < 1)
      throw new Error("Invalid page.");
    this.page = num;
    this.genText();
    this.update();
  }
  nextPage() {
    if (this.page >= this.splitted.length)
      return;
    this.updatePage(this.page + 1);
  }
  previousPage() {
    if (this.page <= 1)
      return;
    this.updatePage(this.page - 1);
  }
  update() {
    if (!this.message)
      return;
    this.splitted = this.splitContent();
    if (this.wait === 0)
      this.messageContent = this.genText();
    else if (this.wait % 2 === 0) {
      this.wait = 0;
      setTimeout(() => {
        this.messageContent = this.genText();
        this.edit();
        this.wait++;
      }, 1e3);
    } else {
      this.messageContent = this.genText();
      this.edit();
      this.wait++;
    }
  }
  edit() {
    if (this.splitted.length > 1)
      this.createMessageComponentMessage();
    this.message?.edit(this.filterSecret(this.messageContent));
  }
  add(content) {
    if (!this.message)
      return;
    this.content += content;
    this.update();
  }
  destroy() {
    this.message?.edit({ components: [] });
    this.messageComponentCollector?.stop();
  }
  genText() {
    return this.options.noCode && this.splitted.length < 2 ? `${this.splitted[this.page - 1]}` : `${codeBlock.construct(
      this.splitted[this.page - 1],
      this.options.lang
    )}

Page ${this.page}/${this.splitted.length}`;
  }
  splitContent() {
    const char = [new RegExp(`.{1,${this.limit}}`, "g"), "\n"];
    const text = import_discord.default.verifyString(this.content);
    if (text.length <= this.limit)
      return [text];
    let splitText = [text];
    while (char.length > 0 && splitText.some((elem) => elem.length > this.limit)) {
      const currentChar = char.shift();
      if (currentChar instanceof RegExp) {
        splitText = splitText.flatMap((chunk) => chunk.match(currentChar)).filter((value) => value !== null);
      } else {
        splitText = splitText.flatMap((chunk) => chunk.split(currentChar));
      }
    }
    if (splitText.some((elem) => elem.length > this.limit)) {
      throw new RangeError("SPLIT_MAX_LEN");
    }
    const messages = [];
    let msg2 = "";
    for (const chunk of splitText) {
      if (msg2 && (msg2 + char + chunk).length > this.limit) {
        messages.push(msg2);
        msg2 = "";
      }
      msg2 += (msg2 && msg2 !== "" ? char : "") + chunk;
    }
    return messages.concat(msg2).filter((m) => m);
  }
};
__name(ProcessManager, "ProcessManager");

// src/utils/codeBlock.ts
var codeBlock = class {
  static construct(content, lang) {
    return `\`\`\`${content ? lang || "" : ""}
${content.replaceAll("```", "\\`\\`\\`")}
\`\`\``;
  }
  static parse(content) {
    const result2 = content.match(/^```(.*?)\n(.*?)```$/ms);
    return result2 ? result2.slice(0, 3).map((el) => el.trim()) : null;
  }
};
__name(codeBlock, "codeBlock");

// src/utils/hljs.ts
var HLJS = class {
  /**
   * Get highlight.js language of given query.
   */
  static getLang(query) {
    if (!query || typeof query !== "string")
      return void 0;
    return this.languages.find((l) => query.endsWith(l));
  }
};
__name(HLJS, "HLJS");
__publicField(HLJS, "languages", [
  "as",
  "1c",
  "abnf",
  "accesslog",
  "actionscript",
  "ada",
  "ado",
  "adoc",
  "apache",
  "apacheconf",
  "applescript",
  "arduino",
  "arm",
  "armasm",
  "asciidoc",
  "aspectj",
  "atom",
  "autohotkey",
  "autoit",
  "avrasm",
  "awk",
  "axapta",
  "bash",
  "basic",
  "bat",
  "bf",
  "bind",
  "bnf",
  "brainfuck",
  "c",
  "c++",
  "cal",
  "capnp",
  "capnproto",
  "cc",
  "ceylon",
  "clean",
  "clj",
  "clojure-repl",
  "clojure",
  "cls",
  "cmake.in",
  "cmake",
  "cmd",
  "coffee",
  "coffeescript",
  "console",
  "coq",
  "cos",
  "cpp",
  "cr",
  "craftcms",
  "crm",
  "crmsh",
  "crystal",
  "cs",
  "csharp",
  "cson",
  "csp",
  "css",
  "d",
  "dart",
  "dcl",
  "delphi",
  "dfm",
  "diff",
  "django",
  "dns",
  "do",
  "docker",
  "dockerfile",
  "dos",
  "dpr",
  "dsconfig",
  "dst",
  "dts",
  "dust",
  "ebnf",
  "elixir",
  "elm",
  "erb",
  "erl",
  "erlang-repl",
  "erlang",
  "excel",
  "f90",
  "f95",
  "feature",
  "fix",
  "flix",
  "fortran",
  "freepascal",
  "fs",
  "fsharp",
  "gams",
  "gauss",
  "gcode",
  "gemspec",
  "gherkin",
  "glsl",
  "gms",
  "go",
  "golang",
  "golo",
  "gradle",
  "graph",
  "groovy",
  "gss",
  "gyp",
  "h",
  "h++",
  "haml",
  "handlebars",
  "haskell",
  "haxe",
  "hbs",
  "hpp",
  "hs",
  "hsp",
  "html.handlebars",
  "html.hbs",
  "html",
  "htmlbars",
  "http",
  "https",
  "hx",
  "hy",
  "hylang",
  "i7",
  "iced",
  "icl",
  "inform7",
  "ini",
  "instances",
  "irb",
  "irpf90",
  "java",
  "javascript",
  "jboss-cli",
  "jinja",
  "js",
  "json",
  "jsp",
  "jsx",
  "julia",
  "k",
  "kdb",
  "kotlin",
  "lasso",
  "lassoscript",
  "lazarus",
  "ldif",
  "leaf",
  "less",
  "lfm",
  "lisp",
  "livecodeserver",
  "livescript",
  "llvm",
  "lpr",
  "ls",
  "lsl",
  "lua",
  "m",
  "mak",
  "makefile",
  "markdown",
  "mathematica",
  "matlab",
  "maxima",
  "md",
  "mel",
  "mercury",
  "mips",
  "mipsasm",
  "mizar",
  "mk",
  "mkd",
  "mkdown",
  "ml",
  "mm",
  "mma",
  "mojolicious",
  "monkey",
  "moo",
  "moon",
  "moonscript",
  "n1ql",
  "nc",
  "nginx",
  "nginxconf",
  "nim",
  "nimrod",
  "nix",
  "nixos",
  "nsis",
  "obj-c",
  "objc",
  "objectivec",
  "ocaml",
  "openscad",
  "osascript",
  "oxygene",
  "p21",
  "parser3",
  "pas",
  "pascal",
  "patch",
  "pb",
  "pbi",
  "pcmk",
  "perl",
  "pf.conf",
  "pf",
  "php",
  "php3",
  "php4",
  "php5",
  "php6",
  "pl",
  "plist",
  "pm",
  "podspec",
  "pony",
  "powershell",
  "pp",
  "processing",
  "profile",
  "prolog",
  "protobuf",
  "ps",
  "puppet",
  "purebasic",
  "py",
  "python",
  "q",
  "qml",
  "qt",
  "r",
  "rb",
  "rib",
  "roboconf",
  "rs",
  "rsl",
  "rss",
  "ruby",
  "ruleslanguage",
  "rust",
  "scad",
  "scala",
  "scheme",
  "sci",
  "scilab",
  "scss",
  "sh",
  "shell",
  "smali",
  "smalltalk",
  "sml",
  "sqf",
  "sql",
  "st",
  "stan",
  "stata",
  "step",
  "step21",
  "stp",
  "styl",
  "stylus",
  "subunit",
  "sv",
  "svh",
  "swift",
  "taggerscript",
  "tao",
  "tap",
  "tcl",
  "tex",
  "thor",
  "thrift",
  "tk",
  "toml",
  "tp",
  "ts",
  "twig",
  "typescript",
  "v",
  "vala",
  "vb",
  "vbnet",
  "vbs",
  "vbscript-html",
  "vbscript",
  "verilog",
  "vhdl",
  "vim",
  "wildfly-cli",
  "x86asm",
  "xhtml",
  "xjb",
  "xl",
  "xls",
  "xlsx",
  "xml",
  "xpath",
  "xq",
  "xquery",
  "xsd",
  "xsl",
  "yaml",
  "yml",
  "zep",
  "zephir",
  "zone",
  "zsh"
].sort().sort((a, b) => b.length - a.length));

// src/utils/system.ts
var System = class {
  /**
   * Get memory info
   *
   * @returns {NodeJS.MemoryUsage}
   */
  static memory() {
    const memory = process.memoryUsage();
    const keys = Object.keys(memory);
    const a = memory;
    keys.forEach((key) => {
      memory[key] = (a[key] / 1024 / 1024).toFixed(2) + "MB";
    });
    return memory;
  }
  static processReadyAt() {
    return new Date(Date.now() - process.uptime() * 1e3);
  }
};
__name(System, "System");

// src/utils/DateFormatting.ts
var DateFormatting = class {
  static _format(date, style) {
    return `<t:${Math.floor(Number(date) / 1e3)}` + (style ? `:${style}` : "") + ">";
  }
  static relative(date) {
    return this._format(date, "R");
  }
};
__name(DateFormatting, "DateFormatting");

// src/utils/count.ts
var import_discord2 = require("discord.js");

// src/utils/type.ts
function typeFind(argument) {
  if (typeof argument === "number" && isNaN(argument))
    return "NaN";
  const parsed = Object.prototype.toString.apply(argument);
  const obj = parsed.slice(1, 7);
  if (obj !== "object")
    return typeof argument;
  const type = parsed.slice(8, parsed.length - 1);
  if (type === "Function") {
    return /^class[\s{]/.test(String(argument)) ? "Class" : "Function";
  } else
    return type;
}
__name(typeFind, "typeFind");

// src/utils/count.ts
function count(argument) {
  if (argument instanceof Map || argument instanceof Set || argument instanceof import_discord2.Collection) {
    argument = Array.from(argument.values());
  }
  if (Array.isArray(argument)) {
    const typed = argument.map(
      (el) => el?.constructor ? el.constructor.name : typeFind(el)
    );
    const obj = {};
    for (const t of typed) {
      if (!obj[t])
        obj[t] = 0;
      obj[t]++;
    }
    const items = Object.keys(obj).map((el) => {
      return { name: el, count: obj[el] };
    });
    const total = items.reduce(
      (previous, current) => previous + current.count,
      0
    );
    return items.map((el) => {
      return {
        name: el.name,
        count: el.count,
        ratio: (el.count / total * 100).toFixed(1)
      };
    }).sort((a, b) => Number(b.ratio) - Number(a.ratio));
  }
  return null;
}
__name(count, "count");

// src/utils/inspect.ts
var import_util = __toESM(require("util"));
function inspect(value, options) {
  return import_util.default.inspect(value, options);
}
__name(inspect, "inspect");

// src/utils/table.ts
function table(obj) {
  clean(obj);
  const max = Object.keys(obj).map((e) => e.toString().length).sort((a, b) => b - a)[0] + 4;
  return Object.keys(obj).map((key) => `${key}${" ".repeat(max - key.length)}:: ${obj[key]}`).join("\n");
}
__name(table, "table");
function clean(obj) {
  for (const propName in obj) {
    if (!obj[propName]) {
      delete obj[propName];
    }
  }
}
__name(clean, "clean");

// src/utils/isinstance.ts
var import_discord3 = require("discord.js");
function isInstance(target, theClass) {
  if (target instanceof import_discord3.Collection && target.map((f) => f instanceof theClass).includes(false)) {
    return false;
  } else if (Array.isArray(target) && target.map((f) => f instanceof theClass).includes(false)) {
    return false;
  } else if (!(target instanceof theClass))
    return false;
  else
    return true;
}
__name(isInstance, "isInstance");

// src/utils/isGenerator.ts
var isGenerator = /* @__PURE__ */ __name((target) => target && typeof target.next === "function" && typeof target.throw === "function", "isGenerator");

// src/utils/regexpEscape.ts
function regexpEscape(string) {
  const str = String(string);
  const cpList = Array.from(str[Symbol.iterator]());
  const cuList = [];
  for (const c of cpList) {
    if ("^$\\.*+?()[]{}|".indexOf(c) !== -1) {
      cuList.push("\\");
    }
    cuList.push(c);
  }
  const L = cuList.join("");
  return L;
}
__name(regexpEscape, "regexpEscape");

// src/utils/join.ts
function join(arr, sep, lastSep) {
  if (arr.length <= 1)
    return arr.join(sep);
  return arr.reduce(
    (text, cur, idx) => [text, cur].join(idx === arr.length - 1 ? lastSep : sep)
  );
}
__name(join, "join");

// src/commands/index.ts
var commands_exports = {};
__export(commands_exports, {
  cat: () => cat,
  curl: () => curl,
  exec: () => exec,
  js: () => js,
  jsi: () => jsi,
  main: () => main,
  shard: () => shard
});

// src/commands/main.ts
var import_discord4 = require("discord.js");

// package.json
var version = "1.0.1";

// src/commands/main.ts
async function main(message2, parent2) {
  const intents = new import_discord4.IntentsBitField(parent2.client.options.intents);
  let summary = `Dokdo v${version}, discord.js \`${import_discord4.version}\`, \`Node.js ${process.version}\` on \`${process.platform}\`
Process started at ${DateFormatting.relative(
    System.processReadyAt()
  )}, bot was ready at ${DateFormatting.relative(parent2.client.readyAt ?? 0)}.
`;
  summary += `
Using ${System.memory().rss} at this process.
`;
  const cache = `${parent2.client.guilds.cache.size} guild(s) and ${parent2.client.users.cache.size} user(s)`;
  if (parent2.client.shard) {
    const guilds = await parent2.client.shard.fetchClientValues("guilds.cache.size").then((r) => {
      const out = r;
      out.reduce((prev, val) => prev + val, 0);
    });
    summary += `Running on PID ${process.pid} for this client, and running on PID ${process.ppid} for the parent process.

This bot is sharded in ${parent2.client.shard.count} shard(s) and running in ${guilds} guild(s).
Can see ${cache} in this client.`;
  } else {
    summary += `Running on PID ${process.pid}

This bot is not sharded and can see ${cache}.`;
  }
  summary += "\n" + join(
    [
      import_discord4.GatewayIntentBits.GuildPresences,
      import_discord4.GatewayIntentBits.GuildMembers,
      import_discord4.GatewayIntentBits.MessageContent
    ].map(
      (u) => `\`${import_discord4.GatewayIntentBits[u]}\` intent is ${intents.has(u) ? "enabled" : "disabled"}`
    ),
    ", ",
    " and "
  ) + ".";
  summary += `
Average websocket latency: ${parent2.client.ws.ping}ms`;
  message2.reply(summary);
}
__name(main, "main");

// src/commands/exec.ts
var import_child_process = __toESM(require("child_process"));
var import_discord5 = require("discord.js");
async function exec(message2, parent2) {
  if (!message2.data.args) {
    message2.reply("Missing Arguments.");
    return;
  }
  const shell = process.env.SHELL || (process.platform === "win32" ? "powershell" : null);
  if (!shell) {
    message2.reply(
      "Sorry, we are not able to find your default shell.\nPlease set `process.env.SHELL`."
    );
    return;
  }
  const msg2 = new ProcessManager(message2, `$ ${message2.data.args}
`, parent2, {
    lang: "bash"
  });
  await msg2.init();
  const res2 = import_child_process.default.spawn(shell, [
    "-c",
    (shell === "win32" ? "chcp 65001\n" : "") + message2.data.args
  ]);
  const timeout = setTimeout(() => {
    kill(res2, "SIGTERM");
    message2.reply("Shell timeout occured.");
  }, 18e4);
  await msg2.addAction(
    [
      {
        button: new import_discord5.ButtonBuilder().setStyle(import_discord5.ButtonStyle.Danger).setCustomId("dokdo$prev").setLabel("Prev"),
        action: ({ manager }) => manager.previousPage(),
        requirePage: true
      },
      {
        button: new import_discord5.ButtonBuilder().setStyle(import_discord5.ButtonStyle.Secondary).setCustomId("dokdo$stop").setLabel("Stop"),
        action: async ({ res: res3, manager }) => {
          res3.stdin.pause();
          kill(res3);
          msg2.add("^C");
          manager.destroy();
        },
        requirePage: false
      },
      {
        button: new import_discord5.ButtonBuilder().setStyle(import_discord5.ButtonStyle.Success).setCustomId("dokdo$next").setLabel("Next"),
        action: ({ manager }) => manager.nextPage(),
        requirePage: true
      }
    ],
    { res: res2 }
  );
  res2.stdout.on("data", (data) => {
    msg2.add(data.toString());
  });
  res2.stderr.on("data", (data) => {
    msg2.add(`[stderr] ${data.toString()}`);
  });
  res2.on("error", (err) => {
    return message2.reply(
      `Error occurred while spawning process
${codeBlock.construct(
        err.toString(),
        "sh"
      )}`
    );
  });
  res2.on("close", (code) => {
    clearTimeout(timeout);
    msg2.add(`
[status] process exited with code ${code}`);
  });
}
__name(exec, "exec");
function kill(res2, signal) {
  if (process.platform === "win32") {
    return import_child_process.default.exec(
      `powershell -File "..\\utils\\KillChildrenProcess.ps1" ${res2.pid}`,
      { cwd: __dirname }
    );
  } else
    return res2.kill("SIGINT");
}
__name(kill, "kill");

// src/commands/js.ts
var import_discord6 = require("discord.js");
async function js(message, parent) {
  const { client } = parent;
  const isMessage = message instanceof import_discord6.Message;
  if (isMessage && !message.data.args) {
    message.reply("Missing Arguments.");
    return;
  }
  const res = new Promise(
    (resolve) => resolve(
      // eslint-disable-next-line no-eval
      eval(
        isMessage ? message.data.args ?? "" : message.options.getString("content", true)
      )
    )
  );
  let typeOf;
  const result = await res.then(async (output) => {
    typeOf = typeof output;
    async function prettify(target) {
      if (target instanceof import_discord6.Embed || target instanceof import_discord6.EmbedBuilder) {
        await message.reply({ embeds: [target] });
      } else if (isInstance(target, import_discord6.Attachment)) {
        await message.reply({
          files: target instanceof import_discord6.Collection ? target.toJSON() : [target]
        });
      }
    }
    __name(prettify, "prettify");
    if (isGenerator(output)) {
      for (const value of output) {
        prettify(value);
        if (typeof value === "function") {
          await message.reply(value.toString());
        } else if (typeof value === "string")
          await message.reply(value);
        else {
          await message.reply(
            inspect(value, { depth: 1, maxArrayLength: 200 })
          );
        }
      }
    }
    prettify(output);
    if (typeof output === "function") {
      typeOf = "object";
      return output.toString();
    } else if (typeof output === "string") {
      return output;
    }
    return inspect(output, { depth: 1, maxArrayLength: 200 });
  }).catch((e) => {
    typeOf = "object";
    return e.toString();
  });
  const msg = new ProcessManager(message, result || "", parent, {
    lang: "js",
    noCode: typeOf !== "object"
  });
  await msg.init();
  await msg.addAction([
    {
      button: new import_discord6.ButtonBuilder().setStyle(import_discord6.ButtonStyle.Danger).setCustomId("dokdo$prev").setLabel("Prev"),
      action: ({ manager }) => manager.previousPage(),
      requirePage: true
    },
    {
      button: new import_discord6.ButtonBuilder().setStyle(import_discord6.ButtonStyle.Secondary).setCustomId("dokdo$stop").setLabel("Stop"),
      action: ({ manager }) => manager.destroy(),
      requirePage: true
    },
    {
      button: new import_discord6.ButtonBuilder().setStyle(import_discord6.ButtonStyle.Success).setCustomId("dokdo$next").setLabel("Next"),
      action: ({ manager }) => manager.nextPage(),
      requirePage: true
    }
  ]);
}
__name(js, "js");

// src/commands/shard.ts
var import_discord7 = require("discord.js");
async function shard(message2, parent2) {
  if (!message2.data.args) {
    message2.reply("Missing Arguments.");
    return;
  }
  if (!parent2.client.shard) {
    message2.reply("Shard Manager not found.");
    return;
  }
  let evalFunction;
  try {
    evalFunction = Function("client", `return ${message2.data.args}`);
  } catch (err) {
    message2.reply(err?.toString() ?? "Error Occurred.");
    return;
  }
  const result2 = await parent2.client.shard.broadcastEval(evalFunction).then((el) => el).catch((e) => e.toString());
  let msg2;
  if (!Array.isArray(result2)) {
    msg2 = new ProcessManager(message2, result2, parent2, { lang: "js" });
  } else {
    let sum;
    if (typeof result2[0] === "number") {
      sum = result2.reduce((prev, val) => prev + val, 0);
    } else if (Array.isArray(result2[0])) {
      sum = result2.reduce((prev, val) => prev.concat(val), []);
    }
    msg2 = new ProcessManager(
      message2,
      `// TOTAL
${inspect(sum, { depth: 1, maxArrayLength: 50 })}

${result2.map(
        (value, index) => `// #${index} SHARD
${inspect(value, {
          depth: 1,
          maxArrayLength: 100
        })}`
      ).join("\n")}`,
      parent2,
      { lang: "js" }
    );
  }
  await msg2.init();
  await msg2.addAction([
    {
      button: new import_discord7.ButtonBuilder().setStyle(import_discord7.ButtonStyle.Primary).setCustomId("dokdo$prev").setLabel("Prev"),
      action: ({ manager }) => manager.previousPage(),
      requirePage: true
    },
    {
      button: new import_discord7.ButtonBuilder().setStyle(import_discord7.ButtonStyle.Secondary).setCustomId("dokdo$stop").setLabel("Stop"),
      action: ({ manager }) => manager.destroy(),
      requirePage: true
    },
    {
      button: new import_discord7.ButtonBuilder().setStyle(import_discord7.ButtonStyle.Success).setCustomId("dokdo$next").setLabel("Next"),
      action: ({ manager }) => manager.nextPage(),
      requirePage: true
    }
  ]);
}
__name(shard, "shard");

// src/commands/jsi.ts
var import_discord8 = require("discord.js");
async function jsi(message, parent) {
  const { client } = parent;
  if (!message.data.args) {
    message.reply("Missing Arguments.");
    return;
  }
  const res = new Promise((resolve) => resolve(eval(message.data.args ?? "")));
  let msg;
  await res.then((output) => {
    const typeofTheRes = typeFind(output);
    const overview = inspect(output, { depth: -1 });
    const constructorName = output && output.constructor ? Object.getPrototypeOf(output.constructor).name : null;
    const arrCount = count(output);
    msg = new ProcessManager(
      message,
      `=== ${overview.slice(0, 100)}${overview.length > 100 ? "..." : ""} ===

${table({
        Type: `${typeof output}(${typeofTheRes})`,
        Name: constructorName || null,
        Length: typeof output === "string" && output.length,
        Size: output instanceof import_discord8.Collection ? output.size : null,
        "Content Types": arrCount ? arrCount.map((el) => `${el.name} (${el.ratio}\uFF05)`).join(", ") : null
      })}`,
      parent,
      { lang: "prolog" }
    );
  }).catch((e) => {
    msg = new ProcessManager(message, e.stack, parent, { lang: "js" });
  });
  await msg.init();
  await msg.addAction([
    {
      button: new import_discord8.ButtonBuilder().setStyle(import_discord8.ButtonStyle.Danger).setCustomId("dokdo$prev").setLabel("Prev"),
      action: ({ manager }) => manager.previousPage(),
      requirePage: true
    },
    {
      button: new import_discord8.ButtonBuilder().setStyle(import_discord8.ButtonStyle.Secondary).setCustomId("dokdo$stop").setLabel("Stop"),
      action: ({ manager }) => manager.destroy(),
      requirePage: true
    },
    {
      button: new import_discord8.ButtonBuilder().setStyle(import_discord8.ButtonStyle.Success).setCustomId("dokdo$next").setLabel("Next"),
      action: ({ manager }) => manager.nextPage(),
      requirePage: true
    }
  ]);
}
__name(jsi, "jsi");

// src/commands/curl.ts
var import_node_fetch = __toESM(require("node-fetch"));
var import_discord9 = require("discord.js");
async function curl(message2, parent2) {
  if (!message2.data.args) {
    message2.reply("Missing Arguments.");
    return;
  }
  let type;
  const res2 = await (0, import_node_fetch.default)(message2.data.args.split(" ")[0]).then(async (r) => {
    const text = await r.text();
    try {
      type = "json";
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      type = HLJS.getLang(r.headers.get("Content-Type")) || "html";
      return text;
    }
  }).catch((e) => {
    type = "js";
    message2.react("\u2757");
    console.log(e.stack);
    return e.toString();
  });
  const msg2 = new ProcessManager(message2, res2 || "", parent2, { lang: type });
  await msg2.init();
  await msg2.addAction([
    {
      button: new import_discord9.ButtonBuilder().setStyle(import_discord9.ButtonStyle.Danger).setCustomId("dokdo$prev").setLabel("Prev"),
      action: ({ manager }) => manager.previousPage(),
      requirePage: true
    },
    {
      button: new import_discord9.ButtonBuilder().setStyle(import_discord9.ButtonStyle.Secondary).setCustomId("dokdo$stop").setLabel("Stop"),
      action: ({ manager }) => manager.destroy(),
      requirePage: true
    },
    {
      button: new import_discord9.ButtonBuilder().setStyle(import_discord9.ButtonStyle.Success).setCustomId("dokdo$next").setLabel("Next"),
      action: ({ manager }) => manager.nextPage(),
      requirePage: true
    }
  ]);
}
__name(curl, "curl");

// src/commands/cat.ts
var import_fs = __toESM(require("fs"));
var import_discord10 = require("discord.js");
async function cat(message2, parent2) {
  if (!message2.data.args) {
    message2.reply("Missing Arguments.");
    return;
  }
  const filename = message2.data.args;
  let msg2;
  import_fs.default.readFile(filename, async (err, data) => {
    if (err) {
      msg2 = new ProcessManager(message2, err.toString(), parent2, { lang: "js" });
    } else {
      msg2 = new ProcessManager(message2, data.toString(), parent2, {
        lang: HLJS.getLang(filename.split(".").pop())
      });
    }
    await msg2.init();
    await msg2.addAction([
      {
        button: new import_discord10.ButtonBuilder().setStyle(import_discord10.ButtonStyle.Danger).setCustomId("dokdo$prev").setLabel("Prev"),
        action: ({ manager }) => manager.previousPage(),
        requirePage: true
      },
      {
        button: new import_discord10.ButtonBuilder().setStyle(import_discord10.ButtonStyle.Secondary).setCustomId("dokdo$stop").setLabel("Stop"),
        action: ({ manager }) => manager.destroy(),
        requirePage: true
      },
      {
        button: new import_discord10.ButtonBuilder().setStyle(import_discord10.ButtonStyle.Primary).setCustomId("dokdo$next").setLabel("Next"),
        action: ({ manager }) => manager.nextPage(),
        requirePage: true
      }
    ]);
  });
}
__name(cat, "cat");

// src/index.ts
var Dokdo = class {
  /**
   * Main Client of Dokdo
   * @param client Discord Client
   * @param options Dokdo Options
   */
  constructor(client2, options) {
    this.client = client2;
    this.options = options;
    if (!(client2 instanceof import_discord11.Client)) {
      throw new TypeError("Invalid `client`. `client` parameter is required.");
    }
    if (options.noPerm && typeof options.noPerm !== "function") {
      throw new Error("`noPerm` parameter must be Function.");
    }
    if (options.globalVariable) {
      if (typeof options.globalVariable !== "object") {
        throw new Error("`globalVariable` parameter must be Object.");
      } else {
        Object.keys(options.globalVariable).forEach((el) => {
          if (options.globalVariable)
            global[el] = options.globalVariable[el];
        });
      }
    }
    if (options.isOwner && !options.owners)
      options.owners = [];
    this.owners = options.owners || [];
    if (!this.options.secrets || !Array.isArray(this.options.secrets)) {
      this.options.secrets = [];
    }
    if (!this.options.aliases)
      this.options.aliases = ["dokdo", "dok"];
    this.process = [];
    client2.once("ready", (client3) => {
      if (!this.owners.length) {
        console.warn("[ Dokdo ] Owners not given. Fetching from Application.");
        client3.application.fetch().then((data) => {
          if (!data.owner) {
            return console.warn("[ Dokdo ] Falied to owner data.");
          }
          if (data.owner instanceof import_discord11.User) {
            return this.owners.push(data.owner.id);
          }
          this.owners = data.owner.members?.map((el) => el.id);
          console.info(
            `[ Dokdo ] Fetched ${this.owners.length} owner(s): ${this.owners.length > 3 ? this.owners.slice(0, 3).join(", ") + ` and ${this.owners.length - 3} more owners` : this.owners.join(", ")}`
          );
        });
      }
    });
  }
  owners;
  process;
  async run(ctx) {
    if (ctx instanceof import_discord11.Message) {
      if (!this.options.prefix)
        return;
      if (!ctx.content.startsWith(this.options.prefix))
        return;
      const parsed = ctx.content.replace(this.options.prefix, "").split(" ");
      const codeParsed = codeBlock.parse(parsed.slice(2).join(" "));
      ctx.data = {
        raw: ctx.content,
        command: parsed[0],
        type: parsed[1],
        args: codeParsed ? codeParsed[2] : parsed.slice(2).join(" ")
      };
      if (!ctx.data.args && ctx.attachments.size > 0 && !this.options.disableAttachmentExecution) {
        const file = ctx.attachments.first();
        if (!file)
          return;
        const buffer = await (await (0, import_node_fetch2.default)(file.url)).buffer();
        const type = { ext: file.name?.split(".").pop(), fileName: file.name };
        if (["txt", "js", "ts", "sh", "bash", "zsh", "ps"].includes(type.ext)) {
          ctx.data.args = buffer.toString();
          if (!ctx.data.type && type.ext !== "txt")
            ctx.data.type = type.ext;
        }
      }
      if (this.options.aliases && !this.options.aliases.includes(ctx.data.command)) {
        return;
      }
      if (!this.owners.includes(ctx.author.id)) {
        let isOwner = false;
        if (this.options.isOwner) {
          isOwner = await this.options.isOwner(ctx.author);
        }
        if (!isOwner) {
          if (this.options.noPerm)
            this.options.noPerm(ctx);
          return;
        }
      }
      if (!ctx.data.type)
        return main(ctx, this);
      switch (ctx.data.type) {
        case "sh":
        case "bash":
        case "ps":
        case "powershell":
        case "shell":
        case "zsh":
        case "exec":
          exec(ctx, this);
          break;
        case "js":
        case "javascript":
          js(ctx, this);
          break;
        case "shard":
          shard(ctx, this);
          break;
        case "jsi":
          jsi(ctx, this);
          break;
        case "curl":
          curl(ctx, this);
          break;
        case "cat":
          cat(ctx, this);
          break;
        default:
          ctx.reply(
            `Available Options: ${Object.keys(commands_exports).filter((t) => t !== "main").map((t) => `\`${t}\``).join(", ")}`
          );
      }
    }
  }
  _addOwner(id) {
    if (!this.owners.includes(id))
      this.owners.push(id);
    return this.owners;
  }
  _removeOwner(id) {
    if (this.owners.includes(id))
      this.owners.splice(this.owners.indexOf(id), 1);
    return this.owners;
  }
};
__name(Dokdo, "Dokdo");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client,
  Commands,
  Utils
});
//# sourceMappingURL=index.js.map