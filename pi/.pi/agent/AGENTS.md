# Global Instructions

## Terraform repos
- Terraform runs in CI via GitHub Actions — never run `terraform apply` locally
- Edit only `.tf` / `.tfvars` files; never modify `.github/workflows/` or backend/state configuration
- Keep files `terraform fmt`-clean; run `terraform validate` before pushing when the CLI is available
