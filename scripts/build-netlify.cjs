const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const frontendDir = path.join(rootDir, "frontend");
const sourceDir = path.join(frontendDir, "dist");
const targetDir = path.join(rootDir, "dist");

const run = (command, args, cwd) => {
  const result = spawnSync(command, args, {
    cwd,
    shell: true,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run("npm", ["install"], frontendDir);
run("npm", ["run", "build"], frontendDir);

fs.rmSync(targetDir, { recursive: true, force: true });
fs.cpSync(sourceDir, targetDir, { recursive: true });
