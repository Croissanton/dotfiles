# Actionable ticket template

veans descriptions are HTML for Vikunja's rich-text editor. Adapt the structure below, render it with ordinary headings/paragraphs/lists, and HTML-escape user-provided text. Do not copy raw Markdown expecting UI formatting or invoke veans prime to impose another workflow. Do not fill every field with unresolved placeholders.

```text
Objective
- Concrete outcome and why it is needed.

Acceptance criteria
- Observable behavior/result.
- Relevant checks that can actually be run.

Repository and context
- Approved repository URL and local checkout mapping, if applicable.
- Canonical documents/links (repo docs or Obsidian references).
- Relevant existing task IDs; do not duplicate their full content.

Dependencies
- Prerequisite tickets, or none.

Allowed scope
- Permitted files/actions, exclusions and significant constraints.
- Whether execution is approved, planning-only, or blocked on a decision.

Completion report
- Changes, actual check results, commit/PR when applicable, blockers/questions.
- Leave incomplete in In Review for human review; do not mark Done.
```

Title: prefer a verb and specific outcome, e.g. Fix timeout handling in the import API, rather than vague Work on API.

If the user requests only planning, use [DRAFT] in the title and explicitly state execution is not approved. --ready is a candidate filter, not permission to execute a draft. Do not claim planning tasks automatically.

Ticket creation/ordinary updates within the approved profile are routine; do not turn them into an exhaustive permissions test. Do not require repo mapping for a non-code administrative/documentation ticket, but never invent a repository path for a coding ticket.

Never put passwords, tokens, private credential file contents, full tool transcripts or authentication links/codes in a ticket.
