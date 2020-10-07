import { run } from "../tool/cmd.tool";
import { checkConfig, checkInPackage } from "../tool/check.tool";

import Command from "./command";

const command = new Command(
  "build",
  (yargs) => {
    return yargs
      .option("skipConfig", {
        type: "boolean",
      })
      .option("skipTs", {
        type: "boolean",
      })
      .option("skipDocker", {
        type: "boolean",
      });
  },
  async (argv) => {
    checkInPackage();
    if (!argv.skipConfig) {
      run("yarn run config");
      checkConfig();
    }
    if (!argv.skipTs) {
      run(
        "yarn run ncc build src/main.ts -o deploy/src/ && cp node_modules/bull/lib/commands/*.lua deploy/src/"
      );
    }
    if (!argv.skipDocker) {
      run("docker-compose build");
    }
  },
  {
    describe: "build mirai bot",
    aliases: ["b"],
  }
);

export = command;
