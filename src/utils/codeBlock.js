module.exports = function codeBlock( content, lang ) {
    return `\`\`\`${lang || ''}
${content}
\`\`\``
}