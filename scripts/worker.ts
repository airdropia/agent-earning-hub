// Default cloud-runner entrypoint for the heavy-task workflow.
// Receives TASK_ID and TASK_PAYLOAD env vars set by the workflow.
// Extend this to do real work (scrape, summarize, transform, build…).
// Secrets stay LOCAL — never hardcode keys here; this repo is public.

const taskId = process.env.TASK_ID ?? "unknown";
const payload = process.env.TASK_PAYLOAD ?? "";

console.log(`[worker] task=${taskId}`);
console.log(`[worker] payload=${payload.slice(0, 500)}`);

// Example work: write a deliverable the workflow uploads as an artifact.
import { mkdirSync, writeFileSync } from "node:fs";

mkdirSync("deliverables", { recursive: true });
writeFileSync(
  `deliverables/${taskId}-result.md`,
  `# Task ${taskId}\n\nExecuted on GitHub Actions runner at ${new Date().toISOString()}.\n\n## Payload\n\n\`\`\`\n${payload}\n\`\`\`\n`,
);

console.log("[worker] deliverable written to deliverables/" + taskId + "-result.md");
