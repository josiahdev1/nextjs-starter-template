@AGENTS.md

# Claude Code Instructions

Always read and follow all rules in [`AGENTS.md`](./AGENTS.md) and [`.agent/rules/ticket-workflow.md`](./.agent/rules/ticket-workflow.md).

- **Automatic Ticket-First Workflow**: Before modifying any code, configuration, or documentation, read `tickets/TEMPLATE.md`, determine the next sequential `tickets/ticket-XX-<slug>.md`, create the ticket with `**Status**: IN PROGRESS` on branch `dev`, implement the changes, run `npm run format`, `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`, record real command outputs, set `**Status**: COMPLETED`, and commit and push to `origin/dev`.
- **Exception**: Skip ticket creation only for purely read-only questions or when the user explicitly says `"no ticket"` or `"read-only"`.
