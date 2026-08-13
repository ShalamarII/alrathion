# Scaffolding Instructions

Rules for maintaining `Reference Folder/Summary.md` and any other whole-vault indexing/scaffolding work in this repo. 

## Exclusions

When enumerating files in this vault (e.g., to rebuild or update `Summary.md`), always exclude:

- `.git/` — version control internal
- `gitignore` - version control internals
- `.gitattributes` - version control internals
- `.obsidian/` — Obsidian app/workspace config
- `.DS_Store` — macOS Finder metadata

Example find command used to enumerate files correctly:

```bash
find . -type f \( -not -path "./.git/*" -not -path "./.obsidian/*" -not -name ".DS_Store" -not -name ".gitattributes" \) | sort
```

## Notes

- Last updated: 2026-08-13
- Applies to any future regeneration of `Summary.md` or similar full-vault listings.

https://obsidian.md/help/obsidian-flavored-markdown
https://obsidian.md/help/advanced-syntax
https://obsidian.md/help/syntax
https://obsidian.md/help/tags
https://obsidian.md/help/callouts
https://obsidian.md/help/links
https://obsidian.md/help/aliases
https://obsidian.md/help/embeds


https://blacksmithgu.github.io/datacore/