import { escapeCodeBlock } from "discord.js";

export class codeBlock {
  static construct(content: string, lang?: string) {
    return `\`\`\`${content ? lang || "" : ""}
${escapeCodeBlock(content)}
\`\`\``;
  }

  static parse(content: string) {
    const result = content.match(/^```(.*?)\n(.*?)```$/ms);
    return result ? result.slice(0, 3).map((el) => el.trim()) : null;
  }
}
