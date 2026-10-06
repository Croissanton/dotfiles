# Vikunja agent configuration

Portable, keyless configuration for the approved Integration Sandbox board. Includes the agent skill, ticket template, deployment-repository pointer, and native veans project/view/bucket mapping. The server and IDs are specific to this installation, not defaults for unrelated servers.

## Install

From this dotfiles checkout, run:

```sh
stow --no-folding --target="$HOME" vikunja-agent
```

This installs the skill under `$HOME/.agents/skills/vikunja` and the profile under `$HOME/.config/vikunja-agent`. Reload skills or restart your agent after installation. Install native veans v2.6.0 separately and ensure it is on PATH.

Run ticket commands from the profile directory:

```sh
cd "$HOME/.config/vikunja-agent"
veans list
```

Authentication must be provisioned privately by the human for each machine/account. Credentials, authentication stores, provisioning scripts, and historical planning documents are not included. Do not run veans init/login to recreate the existing bot or board. Agent/provider authentication (such as Pi's OpenAI login) is separate from Vikunja bot authentication.

Installing this package does not authorize infrastructure changes, unattended workers, or code execution from tickets. See the skill's scope and workflow rules. Deployment-specific instructions live in the private vikunja-infra repository on Adam; the local profile identifies it without granting access.
