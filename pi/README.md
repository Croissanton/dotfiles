# Shared Pi configuration

Stow this package into your home with `stow --no-folding --target="$HOME" pi`. It provides general instructions, custom guard extensions, shared skills, and a keyless shared preferences template. Resource subdirectories can also hold custom prompts, themes, and keybindings after deliberate review.

The `config-sync` package merges shared preferences into machine-local Pi settings and restores declared npm packages. Settings are not directly symlinked because Pi writes device metadata and runtime preferences there. Keep authentication, provider endpoint/MCP configuration with private headers, web-search config, sessions, trust decisions, and generated Herdr files local. Package-managed extensions and skills are restored from package declarations rather than copied from node_modules.

On the laptop, use `pi-config --export` after changing portable preferences or installing npm packages, review the resulting diff, and commit/push. Adam's development account consumes those changes automatically. New loose resources must be added to this package (or vikunja-agent for its specific skill) and committed manually. Use `/reload` or restart Pi after synchronization; default model changes apply to subsequent starts, not necessarily the current conversation.

Pi authentication and Vikunja bot authentication remain separately human-provisioned per account. Sync does not install Pi itself, Node, veans, Herdr, or arbitrary skill prerequisites. Package versions are pinned; update deliberately on the laptop and export to share the new versions.
