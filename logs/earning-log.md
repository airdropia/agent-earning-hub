# Earning log

One entry per loop iteration. Newest first.

## 2026-10-29 — Cycle 4 (four-path sweep per operator direction; PATH 1 deployed)

**Operator direction:** pursue PATH 1 Hondō watcher (fully autonomous), PATH 2 frantic:142 approval assist,
PATH 3 Loopuman, PATH 4 BasedAgents. Rules: abandon on hard gate (wallet signature / KYC / paid account).

### PATH 1 — Hondō Watcher ✅ DEPLOYED (no earnings yet)

Built and deployed an autonomous watcher:
- `scripts/hondo-watcher.ts` — polls `GET /api/agent/tasks?task_type=payment_surface_discovery.v1`,
  claims any offer with `claimable:true` or `capacity_remaining>0`, logs every tick.
- `memory/hondo-watcher.log` — append-only tick/claim log.
- `memory/hondo-claims.jsonl` — JSONL record of successful claims.
- Pi skill `~/.pi/agent/skills/hondo-watcher/SKILL.md`.
- **Windows Task Scheduler task `hondo-watcher` registered, state Ready**, every 15 min for 24 h.

Current board: **20/20 offers still drained** (`cap_rem=0/50`, `rewarded=50/50` each). Watcher will
auto-claim the instant capacity appears. Reward $0.01/execution, Base USDC to 0x2CA4…b72a. Zero spend.

### PATH 2 — frantic:142 approval assist ⛔ No approval email exists

Used ego-browser on x2newd@gmail.com:
- Search `nitrosend` → 1 result: "Your Nitrosend account is ready" (welcome email only, no approval link)
- Search `frantic` → 0 results
- Search `nitrosend OR frantic OR "safe mode"` → 0 results
- Spam folder → only the Frantic agent email verification (already used)

Confirmed: Safe Mode auto-approved campaign 15611 (`approval_state: approved`), so no
"Approve this send" email was ever generated and no runx receipt exists. PATH 2 cannot complete.

### PATH 3 — Loopuman ⛔ Requester-only, not a worker earner

- Registered: `POST https://api.loopuman.com/api/v1/register` with x2newd@gmail.com → 201
  (API key stored in `~/.pi/secrets/loopuman-agent.json`, free $0.10 credit = spending credit)
- MCP server `seesayearn-boop/loopuman-mcp` tools: `ask_human`, `post_task`, `check_task`,
  `get_balance`, `approve_submission`, `benchmark_agent` — **all agent-pays-human**.
- No worker/claim/earn endpoints exist. The "earn USDC" claim in the README has no public API path.
- Note: docs say "no email required," but registration required an email in practice.
- Hard gate: to earn, the agent would have to be hired by a requester; no inbound task feed. ABANDONED.

### PATH 4 — BasedAgents ⛔ Docker + bond gates

API `GET https://api.basedagents.ai/v1/tasks?status=open` → **18 open tasks**:
- 5 × $0.25 USDC "Industrial Sentinel Revenue Guard" — require `docker, automation, x402`
- 5 × $2.00 USDC "Industrial Sentinel Revenue Cashback" — require `docker, automation, x402`
- 8 × $0 free tasks (repo reputation only, no payout)
- Every paid task requires Docker (absent on this machine) and generating ≥0.50 USDC of real
  settled revenue before payout.
- Bounty claims also need wallet proof + **1 bonded USDC per concurrent claim** (refundable, but
  requires capital at risk). Free tasks need no bond but pay $0.
- Hard gates: Docker unavailable + 1 USDC bond capital. ABANDONED for earnings.

### Result

**$0.00 earned this cycle.** PATH 1 is live and idle awaiting Hondō capacity. PATHs 2–4 hit hard gates
(email/identity, requester-only, Docker+bond) and were abandoned per the operator's rules.

**The one active earning mechanism:** `hondo-watcher` on Windows Task Scheduler, every 15 minutes.
When Hondō posts new payment_surface_discovery offers, it auto-claims ($0.01 each, no identity step).

---

## 2026-10-29 — Cycle 3 (frantic:142 attempt; exhausted)

**Rail: Frantic bounty #142 ($3, sealed, safe-mode approval loop) — claimed successfully**
(claim_id 1530ec15-9c70-45f1-b73e-370cc354fcf5, fuse expires Oct 30 06:56 UTC), but **could not complete**.

Steps completed:
- Agent enlisted (agent-c27392), email verified, sworn (oath + lantern + signal seals)
- Payout wallet set (x402, Base USDC 0x2CA4…b72a)
- Nitrosend account (x2newd@gmail.com), API key, brand (hello@zcodeagent.nitrosend.net), physical address, Safe Mode ON
- Entry email to proof@dogfood.nitrosend.net (send receipt id 5250380)
- Contact x2newd@gmail.com + list 12996 + campaign 15611 (scheduled 19:30 UTC)

Blocker: Safe Mode **auto-approved** the campaign (approval_state: approved) instead of holding it
as awaiting_approval. No approval email arrived, no MAP description, no runx receipt — receipt_ref
requires the approve/decline decision on https://app.nitrosend.com/my/map/reviews/<id>. Cannot
fabricate a signed receipt. Delivery artifacts (receipt_ref, description_json, report) cannot be
produced. Claim still open; fuse runs out Oct 30 06:56 UTC.

---

## 2026-10-29 — Cycle 2 (wallet-enabled hunt; real claim attempts)

**Constraint set:** $0 spend. Receiving addresses supplied by operator:
EVM/Base `0x2CA45537aC61394DEb1Ad18897E095A68E7Ab72a`, Solana `3q2zruZVf7mDviRA5BzFHQWsUDMRsbpipu7W3bFisBek`.
Filters: no kyc / no stake / no bond / no purchase. No GitHub-PR bounties (human merge gate).

**Outcome: no submission completed. Every payable rail is gated on access, identity, or funding — not on capability.**

### Discovery

With `wallet_evm` allowed, the feed offers **19 bounties**. Sources ranked by real payout history:

| Bounty | Reward | Gate | Verdict |
|---|---|---|---|
| `direct:abf-growth-guide-5usdc` | $5 | Taskmarket escrow submission | ⛔ taskmarket.dev is a **$50/mo** product; task URLs return "use an invited wallet or task password" |
| `taskmarket:TSK-*` (×3) | $2 ea | invited wallet / task password | ⛔ access-gated, deadlines 22:44 same day |
| `frantic:129` | $16 | *"requires normal paid eligibility or one successful paid bounty"* | ⛔ new agents structurally excluded → 0 paid / 18 rejected |
| `frantic:142` | $3 | `agent_kid, agent_token, verified_email_or_runx_github_identity` | ⚠ claimable at $0 **but** needs email round-trip on operator's address |
| `hondo:a92081dd6c1f` etc. | $0.15 | `participation.mode = INCLUDE` | ⛔ proven ineligible (see below) |

### Hondō — investigated in depth, then closed with proof

Hondō is the only rail that explicitly needs **no key, no signer, no payment**. Two lanes:

1. **`payment_surface_discovery.v1`** — "discover a public HTTP 402 surface", $0.01/execution, Base USDC.
   Free to claim, GET-only, no signing. **All 20 open offers are drained:**
   `cap_rem=0/50` and `rewarded=50/50` on every one (≈1,000 rewards paid, ~$10 total).
   Found a valid 402 target for future use: `https://agent-bounty-feed.dailydollar.workers.dev/v1/bounties` → HTTP 402.
2. **`structured_response.v3`** — live claim attempt made.
   - Attempt 1 → `400 invalid_request`, `field_errors: header.Idempotency-Key` (key is required).
   - Attempt 2 (with Idempotency-Key) → **`409 participation_ineligible`**.
   - Cause confirmed against the saved task: `participation.mode = INCLUDE` requires the reward address to belong to the *frozen accepted-respondent set S*. A brand-new address can never satisfy it.
   - `paid_service_trial.v3` lane requires paying an external service → excluded by the $0 rule.

**Hondō verdict: paid real money (1,000 rewards) but is now closed to new addresses.** Not a scam — simply exhausted + cohort-gated.

### Other rails

| Rail | Finding |
|---|---|
| EXFER | Not a task market. No task/bounty endpoint exists (grep = 0). Only PoW mining. All 3 RPC nodes dead; token only on an illiquid "Innovation Zone" listing. |
| Molt Market | `/health`: `settlement:false`, `withdrawals:false`, `deposits:false`, `operating_mode:"shadow"`, `circuit_breaker_open:true`. Cannot pay out. |
| Agent Task Market (clawmint) | Self-host only, needs Docker + Postgres; `docker` absent. Credits would be local-only. |
| TaskBounty (Magpie MCP) | `list_open_bounties` → `items: []`. |

### The real bottleneck (revised)

Cycle 1 identified "no wallet address". That was wrong — receiving is free and is now solved.
The actual bottleneck is **account/identity verification**, not capability or wallet:

- Hondō → cohort gate (INCLUDE) + exhausted capacity
- Taskmarket → paid platform / invited wallet
- Frantic #129 → prior paid success required
- Frantic #142 → email-identity round-trip (needs operator's inbox)
- clawmint → infrastructure (Docker) the machine lacks

**Next viable action:** frantic:142 ($3) with a free Nitrosend account on an email the operator
controls. Needs from operator: an email address for signup. Everything else (agent registration,
MAP extraction, validation, digest recompute, report) is automatable from this machine.

**Blocked on human:** provide an email address for the free Nitrosend signup (frantic:142), or
accept that no $0 rail is currently completable.


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
