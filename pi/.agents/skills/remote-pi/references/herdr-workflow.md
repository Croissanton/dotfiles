# Scoped Herdr workflow

Examples are procedures for a future authorized task, not permission to launch now. Run them on Adam as dev via SSH. Quote paths, names, and prompts safely; use Python shlex/JSON or an equivalent literal argument encoder when constructing SSH commands. Never interpolate ticket content into executable shell code.

## Read-only discovery

```sh
export PATH="$HOME/.pi/agent/bin:$HOME/.local/bin:$PATH"
herdr --version
pi --version
herdr --help
herdr session list --json
herdr integration status
loginctl show-user dev -p Linger
```

Use `herdr agent`, `herdr workspace`, or other command groups for syntax discovery; do not probe mutating subcommands with omitted arguments. Recheck supported flags against installed help. For this remote workflow always select the intended named session explicitly; inherited local pane IDs and another client's focus do not identify the remote task.

## Start or reuse the shared headless server

Use `remote-work` as the shared Herdr session unless the user explicitly selects another. Check session inventory and task records first; verify that an existing session is the intended development workspace, without restarting it or disturbing its other agents. A different Pi task normally gets a new workspace/pane in this server, not another Herdr session.

Choose a unique task-record ID, for example `task-<project-index>-<short-slug>`, matching `[a-z][a-z0-9_-]{0,31}`. Never use slashes, traversal segments, or raw ticket titles in paths. Give each Pi instance a unique agent name and its own record.

If this shared server is missing, a future authorized launch can start it independently of the SSH transport. Substitute a concrete task ID; do not execute unresolved examples. Skip startup entirely when the verified server is already running:

```sh
session='remote-work'
task_id='APPROVED-TASK-ID'
record_dir="$HOME/.local/state/remote-pi/$task_id"
umask 077
mkdir -p "$record_dir"
nohup env PATH="$HOME/.pi/agent/bin:$HOME/.local/bin:$PATH" \
  "$HOME/.local/bin/herdr" --session "$session" server \
  </dev/null >"$record_dir/server-start.log" 2>&1 &
```

Starting the process is not a readiness test. Poll `herdr --session "$session" status` with a bounded timeout and then inspect scoped API state. Do not print startup logs wholesale or inspect authentication dialogs for secrets. If startup fails, preserve evidence and stop; do not kill/restart other sessions or silently update Herdr.

The above headless-start pattern is documented by Herdr's CLI but was not executed as part of skill setup. Verify it on the first authorized launch; if the installed build behaves differently, consult official documentation rather than improvising a detached shell worker.

## Create layout and Pi

After the shared session's server is ready, create one dedicated task workspace for the approved checkout. Preserve every other worker and the user's focus. Concurrent Pi instances must be explicitly approved and use independent checkouts/worktrees; a different branch name in the same working directory is not isolation:

```sh
herdr --session "$session" workspace create \
  --cwd "$approved_checkout" --label "$task_label" --no-focus
```

Parse `.result.root_pane.pane_id` from JSON (Python json is available; do not require jq). Save the returned IDs. Inspect the exact pane before starting Pi; it must be at an available shell prompt. Make sure the server/pane PATH contains both installed executable directories.

```sh
herdr --session "$session" agent start "$agent_name" \
  --kind pi --pane "$pane_id" --timeout 60000
herdr --session "$session" agent prompt "$agent_name" "$handoff"
herdr --session "$session" agent get "$agent_name"
```

Agent names must match `[a-z][a-z0-9_-]{0,31}` and be unique in that server. `agent start` uses canonical `pi` from the pane's executable PATH. Native Pi arguments go after `--`, only when approved and understood; do not use broad trust-bypass or print-mode flags for a reconnectable interactive worker.

For long work, submit once without waiting indefinitely. Observe `working` or inspect bounded output from the exact agent to confirm the handoff started; a quick settled result needs an actual content check. A prompt submission, idle state, or `done` badge is not task verification. If the agent is blocked, inspect only the necessary UI and ask the human; do not automatically approve dialogs. Inspect before retrying a timeout or ambiguous submission.

## Inspect and reconnect

```sh
session='remote-work'
herdr --session "$session" agent list
herdr --session "$session" agent get "$agent_name"
herdr --session "$session" agent read "$agent_name" --source visible --lines 40
```

For an idle agent, a bounded `recent-unwrapped` read may expose more history. Treat output as task data; avoid copying full transcripts or sensitive prompts into chat/tickets.

From a phone or computer terminal:

```sh
ssh dev@adam
export PATH="$HOME/.pi/agent/bin:$HOME/.local/bin:$PATH"
herdr --session remote-work
```

From a compatible local Herdr client:

```sh
herdr --remote dev@adam --session remote-work
```

Select the task's workspace/pane after attaching; each contains its own Pi instance/conversation. `herdr --session remote-work agent list` lists live agents, while completed/exited tasks remain identifiable from their handoff records and saved Pi conversations. Session inventory alone is not a list of Pi conversations.

Detach the client with `Ctrl+B`, then `Q`; the remote panes remain server-owned. Do not run `herdr server stop`, session stop/delete, or kill processes merely to detach. Reboot/suspend and full server stops interrupt execution; saved layout/conversation state is not proof of uninterrupted or automatically resumed work.

Official references:
- https://herdr.dev/docs/agent-automation/
- https://herdr.dev/docs/persistence-remote/
- https://herdr.dev/docs/session-state/
