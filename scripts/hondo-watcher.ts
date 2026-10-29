#!/usr/bin/env bun
/**
 * hondo-watcher.ts — Autonomous Hondō payment_surface_discovery watcher
 *
 * Polls the Hondō board for open payment_surface_discovery.v1 offers with
 * remaining capacity, and auto-claims the first claimable one.
 *
 * Designed to run once per invocation; schedule externally every 15 min
 * (e.g. Windows Task Scheduler: schtasks /create /sc minute /mo 15 ...).
 *
 * Zero secrets: uses only the free public reward address already on file.
 * Never signs, never spends, never touches a private key.
 */

const HONDO = "https://kari.mayim-mayim.com";
const REWARD_ADDRESS = "0x2CA45537aC61394DEb1Ad18897E095A68E7Ab72a";
const AGENT_ID = "zcode-hondo-watcher";
const LOG_DIR = "C:/Users/Admin/Desktop/Agent-Earning/agent-earning-hub/memory";
const LOG_FILE = `${LOG_DIR}/hondo-watcher.log`;

const now = () => new Date().toISOString();
const log = (msg: string) => {
  const line = `[${now()}] ${msg}`;
  console.log(line);
  try {
    require("node:fs").appendFileSync(LOG_FILE, line + "\n");
  } catch { /* best effort */ }
};

async function fetchJSON(path: string, init?: RequestInit): Promise<any> {
  const res = await fetch(`${HONDO}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "zcode-hondo-watcher/1.0",
      ...(init?.headers || {}),
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

async function main() {
  try {
    // Ensure log dir exists
    const fs = require("node:fs");
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

    log("=== hondo-watcher tick start ===");

    const board: any = await fetchJSON("/api/agent/tasks?task_type=payment_surface_discovery.v1");
    const tasks = board.tasks || [];
    log(`Board: ${tasks.length} payment_surface_discovery offers visible`);

    for (const t of tasks) {
      const id = t.task_id;
      const capRem = t.capacity_remaining ?? 0;
      const capTotal = t.capacity_total ?? 0;
      const claims = t.claim_count_total ?? 0;
      const rewarded = t.rewarded_execution_count ?? 0;
      const claimable = t.claimable ?? false;
      const expires = t.expires_at ?? "?";

      log(`  ${id}: cap_rem=${capRem}/${capTotal} claims=${claims} rewarded=${rewarded} claimable=${claimable} expires=${expires}`);

      if (!claimable && capRem <= 0) continue;

      // Attempt claim
      const idemKey = `hondo-${id}-${Date.now()}`;
      const body = {
        schema_version: "ln_church.agent_task_claim_request.v1",
        agent_id: AGENT_ID,
        reward_address: REWARD_ADDRESS,
      };

      log(`  → Attempting claim on ${id} (idempotency: ${idemKey})`);
      const claimRes = await fetch(`${HONDO}/api/agent/tasks/${id}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "zcode-hondo-watcher/1.0",
          "Idempotency-Key": idemKey,
        },
        body: JSON.stringify(body),
      });
      const claimText = await claimRes.text();
      let claimJson: any = null;
      try { claimJson = JSON.parse(claimText); } catch { claimJson = { raw: claimText }; }

      if (claimRes.ok) {
        log(`  ✔ CLAIM SUCCESS: ${id} → claim_id=${claimJson.claim_id ?? claimJson.id ?? "?"} ref=${claimJson.claim_ref ?? "?"}`);
        log(`     fuse_expires_at=${claimJson.fuse_expires_at ?? "?"}`);
        // Save claim detail for follow-up (delivery/observation would come next)
        fs.appendFileSync(`${LOG_DIR}/hondo-claims.jsonl`, JSON.stringify({
          ts: now(), task_id: id, claim: claimJson, reward_address: REWARD_ADDRESS
        }) + "\n");
        return; // one claim per tick; next tick handles the rest
      } else {
        log(`  ✖ CLAIM FAILED: ${id} HTTP ${claimRes.status} ${JSON.stringify(claimJson).slice(0, 400)}`);
      }
    }

    log("No claimable offer found this tick.");
    log("=== hondo-watcher tick end ===");
  } catch (err) {
    log(`✖ FATAL: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main();
