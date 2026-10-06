# Global Instructions

## Privilege escalation
- NEVER attempt to use `sudo` (or `doas`, `su`, or any privilege escalation) — the interactive
  shell has no passwordless access and a prompt cannot be answered. Provide commands for the user
  to run themselves instead.

## Terraform repos
- Terraform runs in CI via GitHub Actions — never run `terraform apply` locally
- Edit only `.tf` / `.tfvars` files; never modify `.github/workflows/` or backend/state configuration
- Keep files `terraform fmt`-clean; run `terraform validate` before pushing when the CLI is available

## Credentials & secrets
- Never read, write, or print credential files: `.env*`, `.ssh/`, `auth.json`, `*.pem`/`*.key`/`*.p12`/`*.pfx`, `credentials*`, `secrets.*`
- Never expose API keys, tokens, or passwords in outputs, logs, or git history

## Dotfiles
- When creating or editing portable config files, save them under `~/dotfiles/<package>/...`
  (matching the stow layout) and run `stow --no-folding <package>` so the live file is a
  symlink into the repo; keep them keyless — secrets go in a gitignored `.env`

## Shared Pi configuration and synchronization
- Canonical checkout: `~/repos/dotfiles`. Stow package links live under `~/dotfiles/`.
  Read `config-sync/README.md` and `pi/README.md` in that checkout before changing
  synchronization behavior. Shared packages are `pi`, `vikunja-agent`, and `config-sync`;
  `config-sync-auto` is installed only for `dev@adam`.
- When the user requests shared agent configuration changes or synchronization, handle
  the workflow yourself rather than asking them to run ordinary sync commands. Such a
  request authorizes committing/pushing the intended keyless configuration changes,
  not unrelated files, arbitrary repository work, or live service deployment.
- The laptop is the manual authoring side; do not install or enable its sync timer.
  Adam's `dev` account is a pull-only consumer, with `config-sync.timer` refreshing
  every five minutes while its user manager runs. Do not enable lingering yourself;
  administrator changes remain human-only.
- For preferences or npm packages changed through Pi, run `pi-config --export` on the
  authoring machine, then review `pi/.config/pi-shared/settings.json`. This exports
  portable preferences and pins installed npm versions, not credentials or device IDs.
  For directly edited shared preferences, do not export stale local settings over them.
- Add custom extensions, skills, prompts, and themes deliberately to their Stow package.
  Do not blindly copy live agent directories, node_modules, or generated Herdr files.
  Stow the affected packages using `--no-folding`; shared preferences are intentionally
  merged into machine-local settings by `pi-config` instead of symlinking all settings.
- Review Git status, stage explicit intended paths, run `git diff --cached --check`,
  commit, and push. Leave unrelated work (such as Zsh edits) untouched. Never force-push,
  reset, auto-stash, or automatically resolve divergent history to make sync pass.
- After pushing, trigger an immediate refresh from the laptop with:
  `ssh -o BatchMode=yes dev@adam 'systemctl --user start config-sync.service'`.
  Verify `Result=success` and `ExecMainStatus=0` with
  `systemctl --user show config-sync.service -p Result -p ExecMainStatus`, then verify
  the intended resources/preferences/package versions on Adam. If the sync script
  itself changed, a second service invocation may be needed to use the new script.
- For manual incoming updates on the laptop, use `config-sync`; it refuses any local
  checkout edits, including unrelated ones. Stop and report the blocker instead of
  discarding work. A successful sync does not reload an already-running Pi session:
  tell the user to use `/reload` or restart Pi; default-model changes apply on startup.
- Keep model/Vikunja credentials, SSH keys, web-search secrets, sessions, trust decisions,
  device state, and unreviewed MCP/provider endpoint configuration machine-local.
  Let native tools resolve authentication internally. On auth failures or interactive
  prompts, ask for human intervention without inspecting or requesting secrets.
