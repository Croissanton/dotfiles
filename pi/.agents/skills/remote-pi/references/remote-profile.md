# Adam development profile

| Item | Value |
|---|---|
| SSH identity | `dev@adam` |
| Home | `/home/dev` |
| Development checkouts | `/home/dev/repos/<approved-repository>` |
| Herdr executable | `/home/dev/.local/bin/herdr` |
| Pi executable | `/home/dev/.pi/agent/bin/pi` |
| Global instructions | `/home/dev/.pi/agent/AGENTS.md` |
| Default shared Herdr session | `remote-work` |
| Task layout | A separate Pi instance/conversation in its own workspace/pane per task |
| Coordination records | `/home/dev/.local/state/remote-pi/<task-id>/handoff.md` |
| Ticket CLI | `/home/dev/.local/bin/veans` |
| Ticket command directory | `/home/dev/.config/vikunja-agent` |

Verified during skill setup on 2026-10-06: Herdr 0.9.3, Pi 1.0.4, Herdr's Pi integration current (v9), and `Linger=yes`. These are historical observations, not guarantees for future launches. The default Herdr session was stopped; a separate session named `list` was running. Leave unrelated sessions alone. No worker was started during setup. Host suspend policy and unattended operation through logout were not tested.

Export a nonsecret executable PATH for remote launch commands:

```sh
export PATH="$HOME/.pi/agent/bin:$HOME/.local/bin:$PATH"
```

The shared config is pulled automatically to this account. It does not grant Git push access or service-account privileges. Model authentication, ticket authentication, and SSH authentication are independently human-provisioned. Handle each missing capability as a blocker, not a reason to read or copy credential stores.

For a phone reconnect, SSH as dev and attach to `remote-work` (unless a different session was explicitly selected), then choose the task's workspace/pane. List its Pi instances with `herdr --session remote-work agent list`; Herdr's session list lists servers, not the individual Pi conversations. To find recent launches, list task handoff records newest first; each records the shared Herdr session and its task-specific agent/pane. For ticket-only requests, use native veans without starting Herdr or Pi. The deployment source under `/home/vikunja` belongs to another account and is not a development checkout authorized by this profile.
