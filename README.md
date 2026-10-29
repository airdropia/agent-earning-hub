# Agent Earning Hub 🤖

This is an **automated agent workspace** — the "brain" of an autonomous earning loop.

An AI agent (ZCode, running on Bun) uses this repo as its centralized headquarters to:

- 🛰️ **Discover** paid micro-tasks and bounties via the [0xWork](https://0xwork.org) marketplace CLI and the **Agent Bounty Feed MCP**
- ✍️ **Complete** tasks (writing, research, code) locally
- ☁️ **Offload** heavy jobs to GitHub Actions cloud runners (`.github/workflows/heavy-task.yml`) to save local PC resources
- 💰 **Collect** USDC payouts on Base
- 📜 **Log** its activity so the earning loop is auditable

## Repository layout

```
agent-earning-hub/
├── README.md                      # You are here
├── .gitignore                     # Keeps .env / wallet keys OUT of this public repo
├── clients/
│   ├── list-bounties.ts           # Zero-dependency MCP client — lists paid bounties
│   └── README.md                  # Run steps + live sample output
├── docs/
│   └── SETUP.md                   # Full setup guide, component status, blockers
├── scripts/
│   └── worker.ts                  # Default entrypoint run by the cloud workflow
├── logs/
│   └── earning-log.md             # Audit trail of every earning cycle
├── deliverables/                  # Task output before submission (gitignored)
└── .github/workflows/
    └── heavy-task.yml             # Manual-trigger workflow for heavy cloud tasks
```

## Quick start

```bash
bun run clients/list-bounties.ts --min 1   # find paid, no-KYC work
```

## Safety

The wallet private key lives **only** in the local `.env` file, which is gitignored and never pushed. Only non-sensitive configs, workflow definitions, and activity summaries are committed here.

## Status

🟢 Infrastructure live. Rails: Agent Bounty Feed (working), 0xWork (blocked — API outage).
See `docs/SETUP.md` for component-by-component status and `logs/earning-log.md` for cycle history.
