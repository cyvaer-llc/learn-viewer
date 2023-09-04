import { describe, it, expect } from 'vitest';
import { fixBadCodeIndentInList } from "./preprocess-fix-bad-code-indent";

const input: string = `
* \`\`\`python
for counter in range(4):
    print(counter)
\`\`\`

* Another list item
  with some content in it

*
Some stuff below an empty list

* \`\`\`python
for counter in range(5):
    print(counter)
\`\`\`

* \`\`\`python
for counter in range(5, 0):
    print(counter)
\`\`\`

\`\`\`python
A code block just hanging out
\`\`\`

* \`\`\`python
for counter in range(5, 0, -1):
    print(counter)
\`\`\`
`;

const expected: string = `
* \`\`\`python
  for counter in range(4):
      print(counter)
  \`\`\`

* Another list item
  with some content in it

*
Some stuff below an empty list

* \`\`\`python
  for counter in range(5):
      print(counter)
  \`\`\`

* \`\`\`python
  for counter in range(5, 0):
      print(counter)
  \`\`\`

\`\`\`python
A code block just hanging out
\`\`\`

* \`\`\`python
  for counter in range(5, 0, -1):
      print(counter)
  \`\`\`
`;

describe('preprocess-fix-bad-code-indent', () => {
  it('fixes bad code indent in one list items', () => {
    const input = `
* \`\`\`python
for counter in range(4):
    print(counter)
\`\`\`
`;

    const expected = `
* \`\`\`python
  for counter in range(4):
      print(counter)
  \`\`\`
`;
    const result = fixBadCodeIndentInList(input);
    expect(result).toEqual(expected);
  });

  it('fixes bad code indent in many list items', () => {
    const result = fixBadCodeIndentInList(input);
    expect(result).toEqual(expected);
  });

  it('ignores already good code indent', () => {
    const input = `
* \`\`\`python
  for counter in range(4):
      print(counter)
  \`\`\`
`;

    const result = fixBadCodeIndentInList(input);
    expect(result).toEqual(input);
  });

  it(`indents if the code block finishes on the next line`, () => {
    const input = `
* \`\`\`python for counter in range(4): print(counter)
\`\`\`
`;
    const expected = `
* \`\`\`python for counter in range(4): print(counter)
  \`\`\`
`;
    const result = fixBadCodeIndentInList(input);
    expect(result).toEqual(expected);
  });

  it(`correctly handles code blocks on a single line`, () => {
    const input = `
* \`\`\`python for counter in range(4): print(counter)\`\`\`
\`\`\`
def perfectly_valid_code():
    return "because it's a separate code block.";
\`\`\`
`;
    const result = fixBadCodeIndentInList(input);
    expect(result).toEqual(input);
  });
});