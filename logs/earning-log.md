# Earning log

One entry per loop iteration. Newest first.

## 2026-10-29 — Cycle 1 (four-platform verification sweep, $0 budget)

**Constraint set:** exactly $0, no crypto wallet, no gas, no signup KYC, no upfront payment.
Every payout rail was verified against that constraint. Outcome: **no paying task obtainable today.**

| Priority | Platform | Verdict | Evidence |
|---|---|---|---|
| P1 | **EXFER** | ⛔ Not a task market | Repo is a PoW blockchain spec. Grep for task/bounty/math-puzzle endpoint = **0 matches**. Only earning mechanic is Argon2id **mining** (~100 EXFER/block coinbase). All 3 advertised RPC nodes dead (`82.221.100.201`, `89.127.232.155`, `80.78.31.82` → HTTP 000). Token listed only on "Wikaex Innovation Zone" (illiquid). Windows binary exists (`exfer-windows-x86_64.exe`, v1.15.1) but nothing worth mining. |
| P2 | **Agent Bounty Feed** | ⛔ 0 results | `list_bounties` with `exclude_requires=wallet_evm,wallet_solana,kyc,stake,bond` → **29 bounties drop to 0**. Every listed payout settles to a wallet address. |
| P3 | **Molt Market** | ⛔ Cannot pay out | `/health` → `settlement:false`, `withdrawals:false`, `deposits:false`, `operating_mode:"shadow"`, `circuit_breaker_open:true`, reserve `stale` and `observedMicrounits:"0"`. Registration open; money cannot move. |
| P4 | **Agent Task Market** (clawmint) | ⛔ Not deployable here | Self-host only — no hosted instance advertised. Needs Docker + Postgres; `docker: command not found`. Credits would live in a local DB, i.e. not real earnings. |
| — | **TaskBounty** (via Magpie MCP) | ⛔ Empty | `list_open_bounties` → `items: []`. |

**The single binding constraint**

All four platforms fail on the *same* rule: no wallet address. The feed proves
it numerically — 19 bounties clear "no KYC / no stake / no bond" but **0** also clear
"no wallet".

Crucial distinction: **receiving a wallet address is free.** Generating a wallet
costs $0 and needs no funding, no ID, and no gas. Gas is only needed to *spend*
or to satisfy 0xWork's registration/stake gate. A payout rail that *sends* USDC to
your address imposes no cost on the earner.

So "$0 budget" and "no wallet" are separable: keeping **no spending** and relaxing
**no wallet address** unlocks the 19 no-KYC/no-stake/no-bond bounties. Keeping both
leaves the only zero-cost earner as EXFER mining — a token with no liquid market.

**Also confirmed this cycle**

- `0xwork balance` still works (on-chain read); `discover`/`register` still time out (`api.0xwork.org` global outage).
- Local capability: no `docker`, no `cargo`, no Python. Bun 1.4.2 available.
- GitHub-based bounties excluded per operator instruction (human merge gate = 3 months, $0).

**Blocked on human:** decision to relax one of the two constraints above.

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
