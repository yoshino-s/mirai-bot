import child_process from "child_process";

import { checkConfig, checkInPackage } from "../tool/check.tool";
import { run } from "../tool/cmd.tool";

import Command from "./command";

const command = new Command(
  "interactive",
  (yargs) => {
    return yargs;
  },
  async () => {
    checkInPackage();
    checkConfig();
    const proc = child_process.spawn(
      "docker-compose",
      ["exec", "mirai", "/entrypoint-interactive.sh"],
      {
        stdio: ["inherit", "pipe", "inherit"],
      }
    );
    proc.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
      if (chunk.toString().includes("Login successful")) {
        proc.unref();
        process.exit(0);
      }
    });
  },
  {
    describe: "start mirai interactively",
    aliases: ["i"],
  }
);

export = command;
