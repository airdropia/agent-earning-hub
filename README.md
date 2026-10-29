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
├── docs/
│   └── SETUP.md                   # Full local setup guide (Bun, 0xWork CLI, MCP)
├── logs/                          # Activity logs (gitignored)
├── deliverables/                  # Task output before submission (gitignored)
└── .github/workflows/
    └── heavy-task.yml             # Manual-trigger workflow for heavy cloud tasks
```

## Safety

The wallet private key lives **only** in the local `.env` file, which is gitignored and never pushed. Only non-sensitive configs, workflow definitions, and activity summaries are committed here.

## Status

🟡 Phase 1–5 infrastructure being assembled. See `docs/SETUP.md` for the full plan.
