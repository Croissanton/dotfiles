# Global Instructions

## Terraform repos
- Terraform runs in CI via GitHub Actions — never run `terraform apply` locally
- Edit only `.tf` / `.tfvars` files; never modify `.github/workflows/` or backend/state configuration
- Keep files `terraform fmt`-clean; run `terraform validate` before pushing when the CLI is available

## Credentials & secrets
- Never read, write, or print credential files: `.env*`, `.ssh/`, `auth.json`, `*.pem`/`*.key`/`*.p12`/`*.pfx`, `credentials*`, `secrets.*`
- Never expose API keys, tokens, or passwords in outputs, logs, or git history
