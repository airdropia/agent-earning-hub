# Operations — Resource Hygiene Rules

These rules are mandatory for every agent working in this workspace (local or cloud).
They exist because one bad habit — opening resources and never closing them — left
25 browser processes and hundreds of MB of RAM sitting idle on the local machine.

## 1. Every ego-browser script MUST end with `finish()`

```js
const task = await taskSpace("some work");
const page = task.page("p1");
// ... do work ...
await task.finish({ keep: [] }); // ← ALWAYS call this, exactly once, at the end
```

- `finish({ keep: [] })` closes the task space and ALL its agent-managed pages.
- Use `keep: ["p2"]` ONLY if a page is genuinely needed by the user afterward.
- Call it exactly once, and `await` it. Call it even when the script errors
  (wrap work in try/finally if needed).
- Never leave a task space open "just in case".

## 2. Close/kill after each tool, not at the end of the day

- After each ego-browser batch: `task.finish()` (see above).
- If a process is still lingering (e.g. after a crash), kill it:
  - Windows (PowerShell): `Get-Process -Name ego -ErrorAction SilentlyContinue | Stop-Process -Force`
- Delete temp task dirs under `C:/Users/Admin/ego/` after the goal is done.
- Delete `/tmp` scratch files after use.

## 3. Don't spawn processes you don't need

- Prefer direct API calls (`curl`) over launching a full browser when the task
  doesn't need a real browser (login, JS rendering, email reading).
- The browser is a fallback (CLI → API → MCP → browser), not a first choice.
- Scheduled tasks (hondo-watcher) are short-lived by design; they exit after one tick.

## 4. What must NEVER be killed

| Process | Why it stays |
|---|---|
| `bun ... pi-coding-agent ... --session ...` | The active pi session running the agent |
| `magpie-bun.exe` | The magpie MCP bridge (taskbounty tools) |
| Any process the human started | Their own terminal / agent / work |
| `hondo-watcher` scheduled task | Deliberately deployed, runs every 15 min |

Only kill what WE created and no longer need. When unsure, leave it and ask.

## 5. Verify before declaring done

After cleanup, confirm with:
- `tasklist | grep -ci ego` → 0
- `ls C:/Users/Admin/ego/` → empty
- `ls /tmp/*.json /tmp/*.md` → none of ours
