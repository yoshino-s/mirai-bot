import { run } from "../tool/cmd.tool";
import { checkConfig, checkInPackage } from "../tool/check.tool";

import Command from "./command";

const command = new Command(
  "run",
  (yargs) => {
    return yargs
      .option("dev", {
        type: "boolean",
      })
      .option("daemon", {
        type: "boolean",
        alias: ["d"],
      });
  },
  async (argv) => {
    checkInPackage();
    checkConfig();
    if (argv.dev) {
      run("ts-node src/main.ts");
    } else {
      if (argv.daemon) {
        run("docker-compose up -d");
      } else {
        run("docker-compose up");
      }
    }
  },
  {
    describe: "run mirai bot",
    aliases: ["r"],
  }
);

export = command;
