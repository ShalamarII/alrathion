# Datacore Plugin Syntax

Reference notes on the Obsidian **Datacore** plugin, compiled from the official documentation.

Sources:
- https://blacksmithgu.github.io/datacore/ (home)
- https://blacksmithgu.github.io/datacore/quickstart
- https://blacksmithgu.github.io/datacore/data
- https://blacksmithgu.github.io/datacore/code-views
- https://blacksmithgu.github.io/datacore/expressions
- https://blacksmithgu.github.io/datacore/dataview

---

## What is Datacore?

Datacore is "a power tool for Obsidian.md, allowing you to create dynamic views that gather and edit data from the files in your vault." It's the successor to the Dataview plugin — same core idea (index the vault, query it, render views) but faster and more capable.

Key points:
- **Automatic vault indexing** — Datacore indexes the vault on install; indexed data speeds up subsequent launches.
- **Dynamic querying** — query and display metadata from vault files through interactive, live-updating views.
- **Developer-focused** — currently targets users comfortable with JavaScript/TypeScript/JSX; more query interfaces are planned.
- **API access** — available as an npm package (`@blacksmithgu/datacore`) for plugin developers.
- **Performance** — "substantially faster — up to 100x faster than Dataview" thanks to its index design.
- **Finer granularity** — can query individual sections, blocks, lines, list items, and canvas elements, not just whole pages.
- Views support paging and can embed other components inside them.

This vault already uses Datacore — see [Topics/corePHP/Document Filtering.md](<Document Filtering.md>) for a working `datacorejsx` example (a filterable/paginated table of vault pages).

---

## Code Block Types

Datacore views are written in fenced code blocks using one of four language tags:

| Tag | Language |
|-----|----------|
| `datacorejs` | JavaScript |
| `datacorejsx` | JSX (React syntax) |
| `datacorets` | TypeScript |
| `datacoretsx` | TypeScript + JSX |

A code block must return a React component. The global `dc` variable is Datacore's API for querying and state management.

---

## Quickstart Examples

**Simple count:**
```datacorejsx
return function View() {
    const pages = dc.useQuery("@page").length;
    return <p>You have {pages} pages in your vault!</p>;
}
```

**Filtered table:**
```datacorejsx
const COLUMNS = [
    { id: "Name", value: page => page.$link },
    { id: "Rating", value: page => page.value("rating") }
];

return function View() {
    const pages = dc.useQuery("@page and #game");
    return <dc.Table columns={COLUMNS} rows={pages} />;
}
```

Note: as of this writing, only the JS/JSX views are fully implemented; other query interfaces are still in development.

---

## Metadata Model

Datacore is a "metadata index" — it stores info about pages, sections, blocks, list items, canvas files, etc. in an internal database for fast search and view generation.

### Intrinsic vs. user metadata

- **Intrinsic fields** — provided automatically by Obsidian/Datacore, always prefixed with `$` (e.g. `$path`, `$tags`, `$links`). The `$` prefix avoids collisions with your own frontmatter field names (e.g. you can have a `path` property distinct from `$path`).
- **User metadata** — your own frontmatter/inline fields (e.g. `length`, `rating`, `time-played`).

### Example object

A markdown page with frontmatter produces metadata roughly like:

```json
{
    "$name": "Dark Souls",
    "$path": "games/Dark Souls.md",
    "$tags": ["#game", "#game/hard"],
    "$links": [{ "path": "games/Dark Souls 2.md" }, { "path": "games/Elden Ring.md" }],
    "$types": ["page", "markdown", "file", "taggable", "linkable"],
    "$frontmatter": {
        "length": "35 hours",
        "rating": 10,
        "time-played": "2013-06-10"
    }
}
```

### Key fields

- **`$types`** — what kind of object this is (e.g. a markdown page has types `"page"` and `"markdown"`). Filterable in queries.
- **`$parent` / `$sections`** — the index is hierarchical: pages contain sections, sections contain blocks, blocks may contain sub-items. Every object can reference its parent via `$parent`.
- **`$tags`** — de-duplicated list of all tags on the object.
- **`$links`** — de-duplicated list of all links the object references.
- **`$file` / `$path`** — source file path (file-type objects also expose `$path` directly).

---

## JavaScript/JSX Views API

### Hooks & data access

| API | Purpose |
|-----|---------|
| `dc.useQuery(queryString)` | Run a Datacore query string, returns matching objects as an array |
| `dc.useFile(path)` | Get metadata for a specific file |
| `dc.useCurrentFile()` | Get metadata for the current page; updates automatically |
| `dc.query()` | Direct/imperative query loading (advanced use) |
| `dc.useMemo()` | Memoize computed values (grouping/filtering/transforms) for performance |
| `dc.useIndexUpdates()` | Low-level hook that fires on index changes |
| `dc.require()` | Import reusable code from other files/codeblock sections |
| `dc.headerLink()` | Build a reference/link to a specific section within a file |

### Example

```javascript
return function View() {
    const games = dc.useQuery("#game and @page and rating > 7");
    return <p>You have written about {games.length} games!</p>;
}
```

Use `dc.useMemo()` to do grouping/filtering/complex transforms before rendering so the view doesn't recompute unnecessarily on every re-render.

### Built-in components

- `<dc.Table columns={...} rows={...} />` — render query results as a table.

---

## Expression / Query Language

Datacore has its own lightweight expression language, used both for filtering queries (e.g. inside `dc.useQuery("...")`) and from the JS view API.

### Data types

| Type | Example |
|------|---------|
| Number | `1` |
| Boolean | `true` / `false` |
| Text | `"text"` |
| Date | `date(2021-04-18)` |
| Duration | `dur(1 day)` |
| Link | `[[Link]]` |
| List | `[1, 2, 3]` |
| Object | `{ a: 1, b: 2 }` |

### Operators

- **Math**: `+ - * / %` for numbers
- **Comparison**: `> < = != <= >=`
- **String**: `+` to concatenate, `*` to repeat
- **Field access**: direct field references, dot notation (`obj.field`), bracket notation (`obj["field"]`) for dynamic access, and postfix function calls
- **Lambdas**: `(x1, x2) => ...`

### Links in expressions

Retrieve a property from a linked page with: `[[Link]].value`

Query examples seen in the docs:
```
@page
@page and #game
#game and @page and rating > 7
```

---

## Dataview Compatibility

Datacore is a direct successor to Dataview — same core idea (index the vault → query → view) but with:

- **Speed**: up to ~100x faster than Dataview, due to its index design.
- **Granularity**: queries can target individual sections, blocks, lines, and canvas elements, not just whole pages.
- **Developer capabilities**: a richer JS API with React integration for building sophisticated, live-updating UI; supports importing external code files and writing views directly in JSX/TypeScript.
- **Views**: all Datacore views support paging and can embed other components inside them.

(The docs don't provide a Dataview-syntax compatibility/migration example directly — see the Quickstart/Expressions pages above for the current Datacore-native syntax.)

---

## Notes

- Last updated: 2026-08-13
- Compiled from https://blacksmithgu.github.io/datacore/ — refer back to the source for the latest detail (this plugin is still evolving; non-JS query interfaces are in development).
- This vault's existing Datacore usage: [Topics/corePHP/Document Filtering.md](<Document Filtering.md>).
