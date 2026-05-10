const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");

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

loadEnvFile(resolve(__dirname, "../../../.env"));
loadEnvFile(resolve(__dirname, "../.env"));

require("../prisma/seed.js");
