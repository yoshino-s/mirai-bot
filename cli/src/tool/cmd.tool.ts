import child_process from "child_process";

import chalk from "chalk";
export function run(cmd: string, quiet = false) {
  if (!quiet) console.log(chalk`{grey $ ${cmd}}`);
  child_process.execSync(cmd, {
    stdio: quiet ? "ignore" : "inherit",
  });
}
