# Dotfiles

Managed with [GNU Stow](https://www.gnu.org/software/stow/). Each directory is a
package whose contents mirror `$HOME` — e.g. `zsh/.zshrc` links to `~/.zshrc`.

## Install / update

```bash
cd ~/dotfiles
stow <package>
```

## The `pi` package

Contains pi (coding agent) config:

- `.pi/agent/AGENTS.md` — global instructions loaded in every pi session
- `.pi/agent/extensions/inline-bash.ts` — inline bash expansion (`!{cmd}` in prompts)
- `.pi/agent/extensions/credentials-guard.ts` — always-on guard that blocks any tool call touching
  credential files (`.env*`, `.ssh/`, `auth.json`, `*.pem`/`*.key`, `credentials*`, `secrets.*`)
- `.pi/web-search.json` — web-search provider routing (`pi-web-access` extension).
  **Committed keyless by convention:** API keys for search providers go in a gitignored `.env`
  (or exported env vars), never in this file — the package reads e.g. `EXA_API_KEY`/
  `BRAVE_API_KEY`/`TAVILY_API_KEY` from the environment.

Retired (still in git history): a `modes.ts` extension with `/plan` and `/ask` read-only modes.
For the occasional read-only session, pi's built-in flag covers it without any extension:
`pi --tools read,grep,find,ls "analyze and propose a plan"`.

**Always stow `pi` with `--no-folding`.** Without it, stow links the whole
`~/.pi` directory, which also holds machine-specific files (`auth.json`,
`sessions/`, `settings.json`, `npm/`) that should NOT be managed by dotfiles.
`--no-folding` creates real directories and links only the files:

```bash
cd ~/dotfiles
stow --no-folding pi
```

Remove:

```bash
stow -D --no-folding pi
```

After changing `AGENTS.md` or an extension, run `/reload` inside pi to pick up
the changes.
