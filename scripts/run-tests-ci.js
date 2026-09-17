const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const sourceRoot = path.resolve(__dirname, "..", "src");
const testFilePattern = /\.(?:spec|test)\.[jt]sx?$/i;

function findTestFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return findTestFiles(entryPath);
    }
    return testFilePattern.test(entry.name) ? [entryPath] : [];
  });
}

const testFiles = findTestFiles(sourceRoot).sort();
if (testFiles.length === 0) {
  console.error("No frontend test files were found under src.");
  process.exit(1);
}

console.log(`Running ${testFiles.length} frontend test files.`);
const reactScripts = require.resolve("react-scripts/bin/react-scripts.js");
const result = spawnSync(
  process.execPath,
  [reactScripts, "test", "--watchAll=false", "--runInBand", "--runTestsByPath", ...testFiles],
  {
    cwd: path.resolve(__dirname, ".."),
    env: { ...process.env, CI: "true" },
    stdio: "inherit",
  }
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
