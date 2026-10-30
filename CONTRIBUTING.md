# Adding or editing a pattern

Every pattern is three things that live in three places:

| What | Where |
|---|---|
| The pattern code | `<category>/<id>.js` |
| Usage, as tests | `<category>/<id>.test.js` |
| Prose and diagram for the homepage | an entry in `catalog/<category>.js` |

Then add a row to the table in `README.md`. `npm test` fails if any of these is missing.

`creational/singleton.js`, its test and its catalog entry are the reference example. Copy their shape.

## The code file

- Modern JavaScript only: ES modules (`export`), `class`, `#private` fields, `static`, `??=`, optional chaining, arrow functions. No `var`, no constructor functions, no IIFEs (unless the point is to show the old way, as in `modern/module.js`).
- No dependencies. Stick to APIs that exist in both Node 24 and browsers (`EventTarget`, `AbortController`, `structuredClone`, `setTimeout`) unless the pattern is about Node.
- Open with a short JSDoc header: the pattern name and category, the one-sentence intent, and a `Modern JS:` paragraph saying what the language now gives you for free.
- Use a realistic, original example. Think of domains a working developer meets: carts, notifications, file uploads, HTTP clients, editors, feature flags, game entities. Don't copy textbook or dofactory examples (shipping companies, mortgages, Kelly on Broadway).
- Keep it short, 20–80 lines. Comments explain *why*, not what. No `console.log` demos. The tests are the demo.
- Export everything the tests use. Running the file directly should not print anything.

## The test file

- `node:test` + `node:assert/strict`, nothing else.
- Each test reads like a usage example, because the homepage shows it as "Usage". Name tests by behaviour: `'undo restores the previous text'`.
- 2–5 tests. Use `mock.timers` (from `node:test`) rather than real waits for anything time-based.

## The catalog entry

```js
{
  id: 'singleton',            // matches the file name
  name: 'Singleton',
  problem: '...',             // the situation that hurts, in plain words. 1–2 sentences.
  solution: '...',            // what the pattern does about it. Read after "Therefore:". 1 sentence.
  useWhen: ['...', '...'],    // 2–3 concrete situations
  avoidWhen: ['...', '...'],  // 2–3 honest reasons not to use it
  native: '...',              // what modern JS/platform offers instead or alongside. Backticks for code.
  diagram: `classDiagram ...` // Mermaid source
}
```

Writing style: plain, direct sentences in sentence case. No marketing words, no "simply", no "powerful".

Diagram rules (Mermaid 11). They are rendered on the homepage and broken syntax shows as an error:

- Use `classDiagram` for structure, `sequenceDiagram` for message flow, `flowchart LR` for pipelines and state.
- Keep to 3–8 nodes. Show the shape of the idea, not every method.
- Name nodes after the classes and functions in the code file.
- In flowcharts, put any label containing punctuation in quotes: `A["fetch(url)"]`.
- In class diagrams, `$` after a member marks it static, `*` marks it abstract. Avoid `<`, `>`, `{`, `}` inside member text except Mermaid's own `~T~` generics.
