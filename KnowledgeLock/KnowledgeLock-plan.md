# KnowledgeLock — Build Plan

Source spec: `alrathion/KnowledgeLock.md`. This plan is written for **you** (solo dev) to execute step by step. Each feature/step is written as a checkbox so you can track progress directly in Obsidian.

## Terminology recap
- **Module** — a single encryptable snippet (text, image, or link)
- **DM** — creates/owns the config file, encrypts modules, distributes keys
- **Player** — decrypts modules using a key they were given
- **Vault** — the Obsidian vault the plugin runs in

---

## 0. Guiding constraints (keep re-reading these)

- One config file (JSON) holds everything — human-readable at a glance, GUI-editable.
- Encryption/decryption is **per-module**, never whole-vault. Decrypting one module must not touch or require decrypting the rest.
- Re-encryption is per-module too (a Player can "forget" — re-lock something they already opened).
- Multiple independent keys can exist at once; each key only unlocks the module(s) it was assigned to. Entering a key should dynamically reveal whatever it unlocks, nothing more.
- Output renders **inside the plugin's own UI** (a view/modal/panel), not as a raw link to another file. A decrypted module's content is allowed to *contain* a link, but that link can't itself just point to another opaque output file.
- Files stay `.md` and stay editable/queryable in Obsidian (Datacore-compatible) even with encrypted payloads embedded — i.e., don't lock the whole file, just the sensitive fields/blocks inside it.
- Everything ships as a normal Obsidian community-style plugin (`manifest.json` + `main.js`), vault-agnostic, no vault-specific paths hardcoded.

---

## 1. Environment & tooling (one-time setup)

- [x] Node.js, npm, git confirmed available on this machine
- [x] Scaffolded plugin skeleton in this directory (see below) — `package.json`, `tsconfig.json`, `esbuild.config.mjs`, `manifest.json`, `versions.json`, `src/main.ts`, `styles.css`
- [x] Run `npm install` in this folder
- [x] Run `npm run dev` to confirm esbuild watch mode compiles `main.js` without errors
- [ ] Create (or point to) a **throwaway test vault** separate from your real `alrathion` campaign vault — never dogfood encryption code against your only copy of real data
- [ ] Symlink or copy the built plugin folder (`manifest.json`, `main.js`, `styles.css`) into `<test-vault>/.obsidian/plugins/knowledgelock/`
- [ ] Enable the plugin in the test vault (Settings → Community plugins → toggle on) and confirm it loads (check the console for your plugin's startup log)
- [ ] Set up a git repo for the plugin itself (separate from the campaign vault repo) once the skeleton is confirmed working
- [ ] (Optional but recommended) Add the [obsidian-sample-plugin](https://github.com/obsidianmd/obsidian-sample-plugin) repo as a reference tab — the scaffold below is modeled on it

---

## 2. Data model design (do this before writing UI code)

- [ ] Decide the JSON config schema. Rough shape to start from:
  ```json
  {
    "version": 1,
    "keys": {
      "<keyId>": { "hint": "string shown to players", "keyHash": "..." }
    },
    "modules": {
      "<moduleId>": {
        "type": "text | image | link",
        "unlockedBy": ["<keyId>", "<keyId>"],
        "ciphertext": "...",
        "iv": "...",
        "meta": { "title": "...", "tags": ["..."] }
      }
    }
  }
  ```
- [ ] Decide **where** module data physically lives: embedded per-file (e.g. inside a fenced code block or frontmatter field in the `.md` file itself) vs. a single global config JSON referenced by ID from each `.md` file. (The spec asks for *both* "one file for the entire party" AND "each file decryptable individually" — resolve this by keeping one global keystore/config file, but keeping ciphertext for a module colocated in the `.md` file that owns it, so a single file's decrypt operation never touches the rest of the vault.)
- [ ] Define the module ID scheme (stable, collision-resistant, human-debuggable — e.g. `slug + short hash`)
- [ ] Define how a key maps to modules: does a key unlock by explicit module ID list, by tag, or both?
- [ ] Write out 2-3 example modules by hand (plaintext) to sanity-check the schema covers text, image, and link types before writing any code

## 3. Crypto core (no UI yet)

- [ ] Choose the algorithm: AES-GCM via Web Crypto API (`crypto.subtle`) — available in Obsidian's Electron/Chromium runtime, no extra dependency needed
- [ ] Write `encryptModule(plaintext, password) -> { ciphertext, iv, salt }` using PBKDF2 (or scrypt if a library is added) to derive a key from the password, so raw passwords are never stored
- [ ] Write `decryptModule({ ciphertext, iv, salt }, password) -> plaintext`, returning a typed failure (not a thrown crash) on wrong password
- [ ] Write `reencryptModule(plaintext, newOrSamePassword)` — reuses the encrypt function; this is literally how "re-lock a module" works, no separate code path needed
- [ ] Unit-test the crypto module in isolation (encrypt → decrypt round-trip, wrong-key failure, tamper-detection via GCM auth tag) before wiring it into any UI
- [ ] Decide key storage: the plugin should never persist a *plaintext* password. Store only a verifier (hash) per key ID so the plugin can tell the DM "yes that password unlocks key X" without ever writing the password to disk

## 4. Plugin skeleton & lifecycle

- [ ] Implement `onload()` / `onunload()` in `main.ts`
- [ ] Register a plugin settings tab (DM-only settings: manage keys, default behaviors)
- [ ] Register a custom `ItemView` (right-hand pane or modal) that will host decrypted output — this satisfies "output displayed within the plugin instance, not a link to a file"
- [ ] Register a Markdown post-processor (`registerMarkdownCodeBlockProcessor`) for a custom fenced block type, e.g. ` ```knowledgelock `, so encrypted modules render as an interactive "locked module" widget instead of raw JSON when viewing a note
- [ ] Wire a command palette command: "KnowledgeLock: Unlock module", "KnowledgeLock: Re-lock module", "KnowledgeLock: New module"

## 5. DM authoring GUI

- [ ] Modal/view: "Create module" — pick type (text/image/link), enter content, pick which key(s) unlock it, hit save
- [ ] On save: call `encryptModule`, then append/update the result as a ` ```knowledgelock ` block in the target `.md` file (or into the config file, per your decision in step 2)
- [ ] Modal/view: "Manage keys" — create a new key (prompts for a password, stores only the verifier hash + hint), list existing keys, assign/revoke which modules a key unlocks
- [ ] Edit-in-place: DM can open an already-decrypted (still-in-memory) module and edit its plaintext, then re-encrypt on save

## 6. Player unlocking GUI

- [ ] "Enter key" prompt (command palette + a small status-bar or ribbon icon entry point)
- [ ] On correct key entry: scan the vault/config for any modules that key unlocks, decrypt them into memory, and render them in the plugin's output view (not a file link)
- [ ] Locked-module widget (from the code-block post-processor in step 4) shows a placeholder ("🔒 Locked module — enter key to reveal") in reading view until unlocked
- [ ] "Re-lock" action available from the output view — wipes the in-memory plaintext and reverts the widget to locked state (does not require re-entering a password if content wasn't changed, since re-encryption can reuse the same derived key material for the session)
- [ ] Session-only unlock state: decrypted plaintext should live in plugin memory (not written back to disk unencrypted) and clear on Obsidian reload unless the user explicitly left it unlocked

## 7. Vault/document-agnostic & Datacore integration

- [ ] Confirm modules can be embedded in *any* `.md` file, not just a special "config note" — the post-processor from step 4 should work vault-wide
- [ ] Keep encrypted payloads inside a fenced code block (not frontmatter) so the rest of the note's YAML/queryable fields stay untouched and Dataview/Datacore-queryable
- [ ] Expose safe *metadata* (title, tags, module type, locked/unlocked state — never plaintext) as either frontmatter fields or intrinsic-style fields so a `datacorejsx` view can query "all modules tagged #npc" without decrypting them
- [ ] Write one example `datacorejsx` view (reference: `Reference Folder/Syntax/Datacore Plugin Syntax.md` in this vault) that lists all KnowledgeLock modules across the vault in a table, to prove the "extendable via Datacore" requirement works
- [ ] Verify regeneration: editing a note that contains a locked module and saving it should not corrupt the ciphertext block

## 8. Multi-party / "one file, many classes" support

- [ ] Confirm the key→module mapping (step 2) supports many keys unlocking different, overlapping module sets from the *same* underlying file/config, so one shipped vault serves an entire party without per-player files
- [ ] Test with 3+ synthetic keys against overlapping module sets to confirm no key ever reveals a module it wasn't assigned

## 9. Hardening & edge cases

- [ ] Wrong-password UX: clear error, no partial reveal, no stack trace shown to the player
- [ ] Corrupted/tampered ciphertext: GCM auth failure should surface as "this module may be corrupted," not a silent garbage decrypt
- [ ] Large content (big images): decide base64-inline vs. reference-to-attachment-then-encrypt-the-reference; document the tradeoff
- [ ] Concurrent edit safety: if DM edits a note in Obsidian while the plugin is mid-write, don't clobber

## 10. Packaging & distribution

- [ ] Fill out `manifest.json` (id, name, version, minAppVersion, description, author)
- [ ] `npm run build` produces a production `main.js` (no source maps, minified) alongside `manifest.json` and `styles.css`
- [ ] Manual install test: copy just those three files into a fresh vault's `.obsidian/plugins/knowledgelock/` and confirm it works with no `node_modules`/source present
- [ ] Write a short README covering: DM setup flow, Player unlock flow, how to add a new key, how to add a new module
- [ ] (Optional) Submit to the Obsidian community plugin directory once stable, or just distribute the three built files directly to your table

---

## Suggested build order

1. Environment (§1) — done first so everything after this is testable
2. Data model (§2) + Crypto core (§3) — get this right before any UI, it's the part that's hard to change later
3. Plugin skeleton (§4)
4. DM authoring GUI (§5) — you need to be able to create modules before you can test unlocking them
5. Player unlocking GUI (§6)
6. Datacore/document-agnostic pass (§7)
7. Multi-party testing (§8)
8. Hardening (§9)
9. Packaging (§10)
