# Setup — Agent Earning Hub

Status of every component, what works today, and the exact commands.

## Verified environment (2026-10-29)

| Component | Version | State |
|---|---|---|
| Bun | 1.4.2 | ✅ |
| git | 2.55.0.windows.3 | ✅ |
| GitHub CLI | 2.98.0, account `airdropia` (scopes: `repo`, `workflow`) | ✅ |
| Pi | 1.4.0 (`C:\Users\Admin\.bun\bin\pi.exe`) | ✅ |
| `0xwork` CLI | 1.7.13 (installed via `bun add -g @0xwork/cli`) | ✅ installed |
| Agent Bounty Feed MCP | v1.2.0, 4 tools, no auth | ✅ connected |
| ego-browser | v2.1.0 (Chromium automation) | ✅ verified |
| Heavy-task workflow | run `40928951467`, success | ✅ verified |
| 0xWork API | `api.0xwork.org` unreachable (global) | ⛔ blocked |
| 0xWork wallet | `0xB0beD9ebBC6702Ecd63bBE9DC95DEb110184b1Ad` — 0 ETH, 0 USDC, 0 AXOBOTL | ⚠ unfunded, unregistered |

## Rails

### A. Agent Bounty Feed — live earning path

```bash
pi mcp list | grep agent-bounty-feed          # must say: connected, 4 tools
bun run clients/list-bounties.ts --min 1      # discovery
```

Bounties live on their own boards (gofrantic, algora, taskmarket, GitHub issues…).
Read `url` and the board's rules; claiming happens on the source board, not via `0xwork`.

### B. 0xWork — blocked

```bash
0xwork balance     # works (reads Base chain directly)
0xwork discover    # FAILS: api.0xwork.org times out
```

The API host resolves to `178.156.138.132` (Hetzner) and is unreachable from this
machine *and* from independent external proxies — it is a server-side outage, not
a local firewall issue. `balance` works because it reads on-chain.

**Unblock 0xWork (needs human action):**

1. Send **~0.001–0.002 ETH on Base** to `0xB0beD9ebBC6702Ecd63bBE9DC95DEb110184b1Ad` (gas).
2. Acquire **10,000 $AXOBOTL** (≈ $0.003 at $0.0000003/token) for the agent stake.
3. Then, once the API is back:
   ```bash
   0xwork register --name="BountyAgent" \
     --description="Autonomous bounty hunter: writing, research, and code tasks." \
     --capabilities=Writing,Research,Code
   0xwork balance   # confirm stake visible
   ```

Never commit `.env`. Verify protection with `git check-ignore -v .env`.

## Cloud offload

```bash
gh workflow run heavy-task.yml \
  -f task_id=my-task \
  -f runner_script=scripts/worker.ts \
  -f task_payload='{"url":"https://..."}' \
  -f max_minutes=20

gh run list --workflow=heavy-task.yml --limit 3
gh run download <run-id>          # deliverable artifact
```

The runner has **no secrets** (public repo) — it executes code committed here.
Keep anything sensitive (keys, paid API calls) local.

## Safety invariants

1. `.env` is gitignored and forgone — never `git add -f` it.
2. No spending, staking, bridging, or buying without explicit human approval.
3. Skip tasks requiring `kyc`, `purchase`, `stake`, `bond`.
4. Escalate: wallet funding, on-chain actions, KYC, and new public posts made in the human's name.
5. CLI first; ego-browser only as fallback or for visual verification.
