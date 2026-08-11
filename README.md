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
- `.pi/agent/extensions/modes.ts` — `/plan` and `/ask` commands (mutually exclusive, single state):
  `/plan [file]` = read-only with `PLAN.md` writable; `/ask` = read-only, nothing writable;
  `/plan off`/`/ask off` or `--plan`/`--ask` at launch. The active mode is announced to the
  model in the system prompt.
- `.pi/agent/extensions/lib/safe-bash.ts` — shared read-only bash filter used by `modes.ts`
- `.pi/agent/extensions/credentials-guard.ts` — always-on guard that blocks any tool call touching
  credential files (`.env*`, `.ssh/`, `auth.json`, `*.pem`/`*.key`, `credentials*`, `secrets.*`)

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
