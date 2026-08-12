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
