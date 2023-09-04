export function fixBadCodeIndentInList(markdown: string): string {
  // Match a list item that starts with a code block, followed by any number of lines that are missing
  // indentation at two spaces, followed by the end of the code block.
  const lines = markdown.split('\n');
  let currentLine = 0;
  while (currentLine < lines.length) {
    currentLine = fixFirstBadCodeIndentInList(lines, currentLine);
  }

  markdown = lines.join('\n');
  return markdown;
}

function fixFirstBadCodeIndentInList(lines: string[], startingLine: number): number {
  const idxCodeStart = lines.findIndex((line, idx) => idx > startingLine && line.match(/^[*-] ```/));
  if (idxCodeStart === -1) {
    return lines.length;
  }

  if (lines[idxCodeStart].match(/^[*-] ```.*```/)) {
    // The code block is on a single line, so there's nothing to fix. Skip to the next line after it.
    return idxCodeStart + 1;
  }

  const idxCodeEnd = lines.findIndex((line, idx) => idx > idxCodeStart && line.match(/```/));
  const needsIndent = lines.slice(idxCodeStart + 1, idxCodeEnd).some(line => !line.startsWith('  '));
  if (needsIndent) {
    for (let i = idxCodeStart + 1; i <= idxCodeEnd; i++) {
      lines[i] = '  ' + lines[i];
    }
  }
  return idxCodeEnd + 1;
}