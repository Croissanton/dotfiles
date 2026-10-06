# Agent configuration synchronization

`config-sync` pulls trusted configuration from `origin/main` in `~/repos/dotfiles` and restows only `pi`, `vikunja-agent`, and its own package. If the automatic timer is installed, its units are restowed too. Authentication, sessions, caches, machine-local settings, and generated Herdr integration files are not synchronized.

The command never commits, pushes, force-resets, adopts files, or merges divergent history. It stops on any local change in the checkout, an unexpected branch, authentication failure, or Stow conflict. Review and push changes manually on the authoring machine. Automatic updates include executable extensions: treat write access to the remote as authority to run code under the development account.

## Manual installation (laptop)

From the dotfiles checkout:

```sh
stow --no-folding --target="$HOME" config-sync
config-sync
```

No timer is installed by this package. The laptop's unrelated uncommitted changes must be resolved before running a sync. Pi resource changes require `/reload` or restarting Pi.

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
