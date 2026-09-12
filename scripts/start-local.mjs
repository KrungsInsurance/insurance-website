import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const child = spawn(process.execPath, ["--import", "./scripts/sites-env.mjs", "./node_modules/wrangler/bin/wrangler.js", "dev", "--env-file", path.join(root, ".env.local"), "--config", "dist/server/wrangler.json", "--local", "--persist-to", ".wrangler/state", "--ip", "127.0.0.1", "--inspector-port", "0"], { cwd: root, env: process.env, stdio: "inherit" });
child.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
