export class codeBlock {
  static construct (content: string, lang?: string): string {
    return `\`\`\`${content ? lang || '' : ''}
${content.replaceAll('```', '\\`\\`\\`')}
\`\`\``
  }

  static parse (content: string): string[] | null {
    const result = content.match(/^```(.*?)\n(.*?)```$/ms)
    return result ? result.slice(0, 3).map((el) => el.trim()) : null
  }
}
