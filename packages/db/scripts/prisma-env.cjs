const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { spawnSync } = require("node:child_process");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const envContent = readFileSync(filePath, "utf8");

  for (const rawLine of envContent.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

const projectRootEnvPath = resolve(__dirname, "../../../.env");
const packageEnvPath = resolve(__dirname, "../.env");

loadEnvFile(projectRootEnvPath);
loadEnvFile(packageEnvPath);

const result = spawnSync("prisma", process.argv.slice(2), {
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
