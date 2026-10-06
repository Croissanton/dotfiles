# Agent configuration synchronization

`config-sync` pulls trusted configuration from `origin/main` in `~/repos/dotfiles` and restows only `pi`, `vikunja-agent`, and its own package. If the automatic timer is installed, its units are restowed too. Shared preferences from `pi/.config/pi-shared/settings.json` are merged into local Pi settings, preserving machine-specific fields such as device ID. Declared npm packages are pinned and reconciled with `pi update --extensions --no-approve` when the package manifest or Pi version changes. Authentication, sessions, caches, MCP/provider endpoint configuration, web-search configuration, and generated Herdr integration files are not synchronized.

The command never commits, pushes, force-resets, adopts files, or merges divergent history. It stops on any local change in the checkout, an unexpected branch, authentication failure, or Stow conflict. Review and push changes manually on the authoring machine. Automatic updates include executable extensions: treat write access to the remote as authority to run code under the development account.

## Manual installation (laptop)

From the dotfiles checkout:

```sh
stow --no-folding --target="$HOME" config-sync
config-sync
```

No timer is installed by this package. The laptop's unrelated uncommitted changes must be resolved before running a sync. Pi resource changes require `/reload` or restarting Pi.

To publish changes made through Pi's settings or package commands on the laptop:

```sh
pi-config --export
# Review the keyless shared preferences and intentionally added resource files.
git -C ~/repos/dotfiles add pi/.config/pi-shared/settings.json
git -C ~/repos/dotfiles commit -m "Update shared Pi preferences"
git -C ~/repos/dotfiles push
```

The exporter includes documented portable preferences only, excludes device IDs and machine-specific paths/commands, and pins npm declarations to locally installed versions. Other package-source formats require manual review. New custom skills/extensions/prompts/themes must be deliberately added to their Stow package and committed; live directories are never blindly copied. The server is a consumer: local preference changes there are overwritten for keys managed by the shared file on the next sync. Packages/settings removed from the shared file are not automatically removed from a machine; removals need an explicit review.

## Automatic installation (dev@adam only)

Install `config-sync` and `config-sync-auto` with Stow, then run:

```sh
systemctl --user daemon-reload
systemctl --user enable --now config-sync.timer
systemctl --user start config-sync.service
systemctl --user list-timers config-sync.timer
```

Inspect failures with `journalctl --user -u config-sync.service -n 30 --no-pager`. Disable with `systemctl --user disable --now config-sync.timer`.

The timer runs every five minutes while the user's systemd manager is running. Without lingering, it is not guaranteed to run after the last login session ends or before login after reboot. Enabling lingering is an optional human-admin decision, not something this setup performs. Existing Pi sessions are not automatically reloaded or restarted.
