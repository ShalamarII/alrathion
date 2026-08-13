# Templater Plugin Syntax

Reference notes on the Obsidian **Templater** plugin, compiled from the official documentation.

Sources:
- https://silentvoid13.github.io/Templater/ (home)
- https://silentvoid13.github.io/Templater/terminology.html
- https://silentvoid13.github.io/Templater/syntax.html
- https://silentvoid13.github.io/Templater/settings.html
- https://silentvoid13.github.io/Templater/commands/overview.html
- https://silentvoid13.github.io/Templater/commands/dynamic-command.html
- https://silentvoid13.github.io/Templater/commands/execution-command.html
- https://silentvoid13.github.io/Templater/commands/whitespace-control.html
- https://silentvoid13.github.io/Templater/internal-functions/internal-modules/date-module.html
- https://silentvoid13.github.io/Templater/internal-functions/internal-modules/file-module.html
- https://silentvoid13.github.io/Templater/internal-functions/internal-modules/frontmatter-module.html
- https://silentvoid13.github.io/Templater/internal-functions/internal-modules/config-module.html
- https://silentvoid13.github.io/Templater/internal-functions/internal-modules/hooks-module.html
- https://silentvoid13.github.io/Templater/internal-functions/internal-modules/system-module.html
- https://silentvoid13.github.io/Templater/internal-functions/internal-modules/web-module.html
- https://silentvoid13.github.io/Templater/user-functions/overview.html
- https://silentvoid13.github.io/Templater/user-functions/script-user-functions.html
- https://silentvoid13.github.io/Templater/user-functions/system-user-functions.html

---

## What is Templater?

Templater is a template language for Obsidian: it lets you embed variables and function output into notes and execute JavaScript code inside templates, automating manual note-creation tasks (dates, prompts, file metadata, etc.).

This vault already uses Templater — see [templates/meeting-notes.md](<meeting-notes.md>) and [templates/notes.md](<notes.md>) for working examples (date auto-fill, generated filenames, frontmatter pre-fill).

---

## Terminology

- **Template** — a file containing commands that Templater expands to generate content.
- **Command** — a text snippet that starts with `<%` and ends with `%>`.
- **Function** — an object invoked inside a command that returns a value (the replacement string), e.g. `tp.date.now`.
- **Internal Functions** — predefined functions built into the plugin (the `tp.*` modules below).
- **User Functions** — custom functions you define yourself, either as script functions or system-command functions, invoked as `tp.user.<name>()`.

---

## Core Syntax

A command must have both an opening tag `<%` and closing tag `%>`:

```
<% tp.date.now() %>
```

All functions live under the `tp` namespace and are called like normal JS:

```
tp.date.now()
tp.file.title
tp.app.activeFile
```

Arguments are positional: `tp.date.now(arg1_value, arg2_value, ...)`.

Argument types:
- **Strings** — `"value"` or `'value'`
- **Numbers** — `15`, `-5`
- **Booleans** — exactly `true` or `false` (lowercase)

Reading a function signature like:
```
tp.date.now(format?: string = "YYYY-MM-DD", offset?: number|string)
```
- `?` = optional argument
- `=` = default value
- `|` = multiple accepted types

Valid call: `<% tp.date.now("YYYY-MM-DD", 7) %>`
Invalid: `tp.date.now(format: string = "YYYY-MM-DD")` (don't name arguments — pass by position)

---

## Command Types

| Tag | Type | Behavior |
|-----|------|----------|
| `<% ... %>` | Interpolation command | Outputs the result of the expression inline |
| `<%* ... %>` | Execution command | Runs JavaScript; outputs nothing by default |
| `<%+ ... %>` | Dynamic command | Re-evaluates in preview mode (deferred execution) |

### Interpolation commands

```
Yesterday: <% tp.date.yesterday("YYYY-MM-DD") %>
Tomorrow: <% tp.date.tomorrow("YYYY-MM-DD") %>
```

### Execution commands (`<%* %>`)

Run arbitrary JavaScript, with access to `tp`, and globals like `app` and `moment`. To actually output something, append to the `tR` string variable:

```
<%*
if (tp.file.title == "MyFile") {
  tR += "This is my file!";
} else {
  tR += "This isn't my file!";
}
%>
```
- Async functions need `await` (e.g. `await tp.system.prompt(...)`).
- You can overwrite `tR` entirely to discard previously generated content (e.g. to suppress unwanted frontmatter).

### Dynamic commands (`<%+ %>`)

Execute only when the note is viewed in preview mode, rather than at template-insertion time:

```
Last modified date: <%+ tp.file.last_modified_date() %>
```

⚠️ Known limitation: preview mode caches the rendered note, so a dynamic command only runs once when the note is first opened (close/reopen to refresh). The docs note dynamic commands "have known issues, and will likely not be maintained going forward" — Dataview (or Datacore) is recommended instead for most live-updating use cases. See [Datacore Plugin Syntax.md](<Datacore Plugin Syntax.md>).

### Whitespace control

By default, a command is replaced by its output but surrounding newlines are kept, which can leave blank lines (especially with execution commands / `if` blocks).

| Modifier | Position | Effect |
|----------|----------|--------|
| `<%_` | tag start | trims **all** whitespace before the command |
| `_%>` | tag end | trims **all** whitespace after the command |
| `<%-` | tag start | trims a **single newline** before the command |
| `-%>` | tag end | trims a **single newline** after the command |

Example — without whitespace control this leaves blank lines:
```
<%* if (tp.file.title == "MyFile" ) { %>
This is my file!
<%* } else { %>
This isn't my file!
<%* } %>
Some content ...
```

With `-%>` whitespace control, the blank lines are removed:
```
<%* if (tp.file.title == "MyFile" ) { -%>
This is my file!
<%* } else { -%>
This isn't my file!
<%* } -%>
Some content ...
```

---

## Internal Functions (`tp.*` modules)

### tp.date

| Function | Signature | Notes |
|----------|-----------|-------|
| `tp.date.now()` | `(format = "YYYY-MM-DD", offset?: number\|string, reference?: string, reference_format?: string)` | Current date; `offset` is days (number) or an ISO 8601 duration string; `reference` lets you base it off another date (e.g. the note title) |
| `tp.date.tomorrow()` | `(format = "YYYY-MM-DD")` | Next day's date |
| `tp.date.yesterday()` | `(format = "YYYY-MM-DD")` | Previous day's date |
| `tp.date.weekday()` | `(format = "YYYY-MM-DD", weekday: number, reference?: string, reference_format?: string)` | Date of a specific weekday relative to a reference; `0` = Monday by default locale, negative = previous weeks |

Examples:
```
<% tp.date.now("Do MMMM YYYY") %>
<% tp.date.now("YYYY-MM-DD", -7) %>
<% tp.date.tomorrow("Do MMMM YYYY") %>
<% tp.date.yesterday() %>
<% tp.date.weekday("YYYY-MM-DD", 0) %>   <!-- this week's Monday -->
```

### tp.file

| Function/Property | Description |
|---|---|
| `tp.file.content` | The file's string contents at template execution time |
| `tp.file.create_new(template, filename = 'Untitled', open_new = false, folder?)` | Creates a new file from a template/content |
| `tp.file.creation_date(format = "YYYY-MM-DD HH:mm")` | Current file's creation date |
| `tp.file.cursor(order?)` | Sets cursor position after template insertion |
| `tp.file.cursor_append(content)` | Appends content after the active cursor position |
| `tp.file.exists(filepath)` | Checks if a file exists (vault-relative path) |
| `tp.file.find_tfile(filename)` | Finds a file and returns its `TFile` instance |
| `tp.file.folder(absolute = false)` | File's folder name, or vault-absolute path |
| `tp.file.include(include_link)` | Includes another file's content (with template resolution); supports section/block links |
| `tp.file.last_modified_date(format = "YYYY-MM-DD HH:mm")` | File's last-modified date |
| `tp.file.move(new_path, file_to_move?)` | Moves the file |
| `tp.file.path(relative = false)` | Absolute system path, or vault-relative path |
| `tp.file.rename(new_title)` | Renames the file (keeps extension) |
| `tp.file.selection()` | Currently selected text |
| `tp.file.tags` | File's tags as a string array |
| `tp.file.title` | File's title |

### tp.frontmatter

Exposes frontmatter variables via dot notation: `tp.frontmatter.<variable_name>`.

For keys with spaces, use bracket notation: `tp.frontmatter["variable name"]`.

```
<% tp.frontmatter.alias %>
```

For list-type frontmatter values, use normal JS array methods (`.map()`, `.join()`, etc.) to format the output.

### tp.config

Runtime configuration/context, read-only:

| Property | Description |
|---|---|
| `tp.config.active_file?` | The active file (if any) when Templater was launched |
| `tp.config.run_mode` | The `RunMode` — how Templater was launched (new file, append, etc.) |
| `tp.config.target_file` | `TFile` for the destination file receiving the template |
| `tp.config.template_file` | `TFile` for the template file itself |

### tp.hooks

| Function | Description |
|---|---|
| `tp.hooks.on_all_templates_executed(callback_function: () => any)` | Runs `callback_function` once all actively running templates finish (useful when using `tp.file.include`/`tp.file.create_new`, which can chain templates). Multiple registrations run their callbacks in parallel. |

Examples:
```javascript
tp.hooks.on_all_templates_executed(async () => {
  const file = tp.file.find_tfile(tp.file.path(true));
  await tp.app.fileManager.processFrontMatter(file, (frontmatter) => {
    frontmatter["key"] = "value";
  });
});

tp.hooks.on_all_templates_executed(() => {
  tp.app.commands.executeCommandById("obsidian-linter:lint-file");
});
```

### tp.system

| Function | Signature | Description |
|---|---|---|
| `tp.system.clipboard()` | `()` | Returns clipboard contents |
| `tp.system.prompt()` | `(prompt_text?, default_value?, throw_on_cancel = false, multiline = false, select_default_value = false)` | Spawns a prompt modal, returns user input |
| `tp.system.suggester()` | `(text_items, items, throw_on_cancel = false, placeholder = "", limit?, default_value?)` | Spawns a suggester modal, returns the chosen item |
| `tp.system.multi_suggester()` | `(text_items, items, throw_on_cancel = false, title = "", limit?, default_values?)` | Like `suggester`, but allows selecting multiple items |

Examples:
```
<% tp.system.clipboard() %>
<% await tp.system.prompt("What is your mood today?", "happy") %>
<% await tp.system.suggester(["Happy", "Sad", "Confused"], ["Happy", "Sad", "Confused"]) %>
<% await tp.system.multi_suggester(["Happy", "Sad", "Confused"], ["Happy", "Sad", "Confused"]) %>
```

### tp.web

| Function | Signature | Description |
|---|---|---|
| `tp.web.daily_quote()` | `(language?: string)` | Fetches a daily quote as a callout (English by default/fallback; Spanish quotes from a separate source) |
| `tp.web.random_picture()` | `(size?: string, query?: string, include_size?: boolean)` | Random image from unsplash.com; `query` accepts comma-separated search terms |
| `tp.web.request()` | `(url: string, path?: string)` | Makes an HTTP request; `path` optionally extracts a specific field from the JSON response |

Examples:
```
<% await tp.web.daily_quote() %>
<% await tp.web.daily_quote("es") %>
<% await tp.web.random_picture() %>
<% await tp.web.random_picture("200x200") %>
<% await tp.web.random_picture("200x200", "landscape,water") %>
<% await tp.web.request("https://jsonplaceholder.typicode.com/todos/1") %>
<% await tp.web.request("https://jsonplaceholder.typicode.com/todos", "0.title") %>
```

### tp.app / tp.obsidian

`tp.app` exposes Obsidian's global `app` object (e.g. `tp.app.activeFile`, `tp.app.commands`, `tp.app.fileManager`) for direct API access. `tp.obsidian` exposes the Obsidian API module itself, for advanced scripting. (Consult the live docs for the full method lists — these two modules are thin wrappers around Obsidian's own API rather than Templater-specific functions.)

---

## User Functions

Custom functions, invoked as `tp.user.<function_name>()`. Not currently supported on Obsidian Mobile. Two kinds:

### Script user functions

1. Set a **user scripts folder** in Templater settings; every `.js` file there becomes available under `tp.user`.
2. Scripts follow the CommonJS module spec — export a single function or an object of functions.
3. The function's name matches the file name.
4. Global variables like `app` and `moment` are available automatically; template-scoped variables (`tp`, `tR`) must be passed in as arguments if needed.

Single-function export:
```javascript
module.exports = function (msg) {
    return `Message from my script: ${msg}`;
};
```
Called as: `<% tp.user.my_script("Hello World!") %>`

Multi-function (object) export:
```javascript
module.exports = {
  note: (text) => formatAsCallout(text, "note"),
  tip: (text) => formatAsCallout(text, "tip"),
  warning: (text) => formatAsCallout(text, "warning"),
};
```
Called as: `<% tp.user.my_script.note("Line 1\nLine2") %>`

TSDoc comments at the top of the file enable intellisense:
```javascript
/**
 * This does something cool
 */
function doSomething() {
    console.log('Something was done')
}

module.exports = doSomething;
```

### System command user functions

Must be explicitly enabled in settings (security). Setup: Settings → Templater → "Add User Function" → name it and associate it with a system command. Runs like an internal function via `tp.user.<name>`.

- Pass arguments as a JS object, e.g. `{arg1: value1, arg2: value2}` — they become environment variables available to the executed command/script (e.g. `$a`, `$b` in a bash script).
- Internal Templater functions embedded in the command string are resolved *before* the system command runs, e.g. `cat <% tp.file.path() %>` becomes `cat /path/to/file` before execution.

---

## Settings Reference

- **Template folder location** — which folder holds your templates.
- **Syntax highlighting** (desktop / mobile) — highlights Templater commands in edit mode; mobile highlighting may affect live preview, use cautiously.
- **Automatic jump to cursor** — auto-triggers `tp.file.cursor` after inserting a template.
- **Template hotkeys** — bind a template to a hotkey; each template exposes both an *Insert* command (adds to active file) and a *Create* command (new note from template).
- **Trigger Templater on new file creation** — auto-processes templates on file creation (compatible with Daily Notes, Calendar, etc.). When enabled:
  - **Excluded folders** — folders where auto-templating is skipped.
  - **Template matching mode** — `None`, `Folder templates` (hierarchy-based — most specific/deepest matching folder wins), or `File regex templates` (pattern-based, rules apply in order, first match wins).
- **Startup templates** — run once when Templater starts; produce no output (side-effect only).
- **User script functions** — set the user scripts folder; configure Intellisense verbosity.
- **User system command functions** — enable/add system-command functions; configurable timeout (default 5s) and optional custom shell binary path.

---

## Notes

- Last updated: 2026-08-13
- Compiled from https://silentvoid13.github.io/Templater/ — refer back to the source for the latest detail, especially the `tp.app`/`tp.obsidian` full API surface.
- This vault's existing Templater usage: [templates/meeting-notes.md](<meeting-notes.md>), [templates/notes.md](<notes.md>).
