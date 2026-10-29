#!/usr/bin/env bun
/**
 * Minimal Agent Bounty Feed MCP client — lists open, paid, no-KYC bounties.
 *
 * Zero dependencies. Runs on Bun (https://bun.sh). No API key, no auth, no wallet.
 *
 *   bun run clients/list-bounties.ts
 *   bun run clients/list-bounties.ts --min 5 --limit 10
 *   bun run clients/list-bounties.ts --json
 *
 * What it does, in MCP terms:
 *   1. POST  initialize          → protocol handshake, reads serverInfo
 *   2. POST  notifications/initialized
 *   3. POST  tools/call list_bounties { min_payout, exclude_requires, limit }
 *   4. prints a ranked table (or raw JSON with --json)
 *
 * Server: https://agent-bounty-feed.dailydollar.workers.dev/mcp (streamable HTTP)
 */

const MCP_URL = "https://agent-bounty-feed.dailydollar.workers.dev/mcp";

// ---------- tiny CLI arg parser ----------
const argv = process.argv.slice(2);
const flag = (name: string, fallback?: string): string | undefined => {
  const i = argv.indexOf(`--${name}`);
  return i !== -1 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};
const asJson = argv.includes("--json");
const minPayout = Number(flag("min", "1"));
const limit = Number(flag("limit", "20"));
// no-friction work by default: no KYC, no stake, no bond, nothing to purchase
const excludeRequires = flag("exclude", "kyc,stake,bond,purchase")!;

// ---------- JSON-RPC over streamable HTTP ----------
let nextId = 1;
async function rpc(method: string, params: unknown = {}, id: number | null = nextId++): Promise<any> {
  const body: Record<string, unknown> = { jsonrpc: "2.0", method, params };
  if (id !== null) body.id = id;

  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // The server may answer with plain JSON or an SSE stream; accept both.
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText} on ${method}`);

  const text = await res.text();
  // Notifications get an empty 202 Accepted — nothing to parse.
  if (id === null || text.trim() === "") return undefined;
  // SSE framing: pull the payload out of the last "data:" line.
  const payload = text.includes("data:")
    ? text.split("\n").filter((l) => l.startsWith("data:")).map((l) => l.slice(5).trim()).pop()!
    : text;

  const msg = JSON.parse(payload);
  if (msg.error) throw new Error(`${method}: ${msg.error.message ?? JSON.stringify(msg.error)}`);
  return msg.result;
}

/** MCP text results arrive as content[].text containing a JSON string. */
function unwrap<T = any>(result: any): T {
  if (result?.structuredContent) return result.structuredContent as T;
  const textBlock = result?.content?.find((c: any) => c.type === "text")?.text;
  if (typeof textBlock === "string") {
    try { return JSON.parse(textBlock) as T; } catch { return textBlock as unknown as T; }
  }
  return result as T;
}

// ---------- main ----------
try {
  const init = await rpc("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "minimal-bounty-client", version: "1.0.0" },
  });
  await rpc("notifications/initialized", {}, null); // one-way notification: no id

  const { tools } = await rpc("tools/list");
  const hasList = tools?.some((t: any) => t.name === "list_bounties");
  if (!hasList) throw new Error("server has no list_bounties tool");

  const feed = unwrap<{ items: any[]; total_matching: number; generated_at: string }>(
    await rpc("tools/call", {
      name: "list_bounties",
      arguments: { min_payout: minPayout, exclude_requires: excludeRequires, limit },
    }),
  );

  if (asJson) {
    console.log(JSON.stringify(feed, null, 2));
    process.exit(0);
  }

  const items = feed.items ?? [];
  console.log(`\n  ${init.serverInfo?.title ?? "Agent Bounty Feed"} · v${init.serverInfo?.version ?? "?"}`);
  console.log(`  Generated ${feed.generated_at ?? "?"} · showing ${items.length} of ${feed.total_matching ?? "?"} matching bounties`);
  console.log(`  Filters: min $${minPayout} · excluding: ${excludeRequires}\n`);
  if (!items.length) { console.log("  No matching bounties right now.\n"); process.exit(0); }

  for (const [i, b] of items.entries()) {
    // Track-record triage: the feed embeds paid/rejected counts in `eligibility`.
    const track = /(\d+) paid \/ (\d+) rejected/.exec(b.eligibility ?? "");
    const payoff =
      track && Number(track[2]) > 0
        ? Number(track[1]) === 0
          ? `⚠ ${track[1]} paid / ${track[2]} rejected — no payouts recorded`
          : `✓ ${track[1]} paid / ${track[2]} rejected`
        : "";
    console.log(`  ${String(i + 1).padStart(2)}. $${String(b.est_usd ?? b.reward).padEnd(6)} ${b.title}`);
    console.log(`      id:       ${b.id}`);
    console.log(`      source:   ${b.source} · ${b.network ?? "?"}${b.deadline ? ` · deadline ${b.deadline}` : ""}`);
    if (b.requires?.length) console.log(`      requires: ${b.requires.join(", ")}`);
    if (payoff) console.log(`      record:   ${payoff}`);
    console.log(`      url:      ${b.url}\n`);
  }
  console.log(`  Tip: verify terms on the source board before working. Set a wallet with \`0xwork init\`.\n`);
} catch (err) {
  console.error(`\n  ✖ ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
}
