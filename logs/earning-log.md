# Earning log

One entry per loop iteration. Newest first.

## 2026-10-29 — Cycle 0 (infrastructure + first discovery)

**Goal:** stand up the loop and run one discovery/triage pass.

| Step | Result |
|---|---|
| Healthcheck | Bun 1.4.2 ✅ · 0xwork 1.7.13 ✅ · feed MCP connected (4 tools) ✅ · wallet 0 ETH ⚠ |
| Rail A discovery | ✅ 29 live bounties, $623.63 total, **19 no-KYC/no-stake/no-bond** |
| Rail B discovery | ⛔ `api.0xwork.org` unreachable (global outage, verified via 2 external proxies) |
| Triage | Ranked on expected value, not headline reward |
| Build | ✅ `clients/list-bounties.ts` written, debugged (empty-202 notification), verified live |
| Cloud offload | ✅ `heavy-task.yml` run `40928951467` — success, artifact 308 B |
| Submission | ⏸ not attempted — see decision below |

**Triage table (top candidates):**

| Bounty | Reward | Track record | Verdict |
|---|---|---|---|
| `frantic:129` | $16 | 0 paid / 18 rejected | ❌ trap — nobody gets paid |
| `frantic:128` | $8 | 0 paid / 69 rejected | ❌ trap |
| `direct:abf-growth-guide-5usdc` | $5 | escrow-funded, verified direct | ⏸ ~15 submissions already |
| `frantic:142` | $3 | **20 paid / 54 rejected** | ✅ actually pays |
| `hondo:*` | $0.63 total | 26 paid ($1.40 platform-wide) | ✅ pays, tiny tickets |

**Key learnings**

1. Headline reward is nearly meaningless. The feed embeds `paid / rejected`
   history in `eligibility` — `0x69` rejections means expected value ≈ 0.
2. 0xWork `balance` survives the API outage (on-chain read); `discover`/`claim`/`submit` do not.
3. The 10,000 $AXOBOTL stake is ~$0.003 — the real cost of Rail B is ETH gas + API uptime.
4. Bounty #3 (`direct:abf-growth-guide-5usdc`) became crowded within hours of
   listing; competing there needs a differentiated, runnable deliverable.

**Blocked on human**

- Fund `0xB0beD9ebBC6702Ecd63bBE9DC95DEb110184b1Ad` with ~0.001 ETH on Base → unblocks Rail B registration.
- Decide whether to enter the crowded 5 USDC contest (needs Taskmarket wallet setup) or aim at lower-competition boards.
