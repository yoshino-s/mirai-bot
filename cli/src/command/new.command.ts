import { join } from "path";

import inquirer from "inquirer";

import { modify } from "../tool/fs.tool";
import { run } from "../tool/cmd.tool";

import Command from "./command";

const command = new Command(
  "new [path]",
  (yargs) => {
    return yargs
      .positional("path", {
        describe: "path to create project",
        type: "string",
      })
      .option("name", {
        type: "string",
        alias: ["n"],
      });
  },
  async (argv) => {
    let name: string;
    if (!argv.name) {
      name = (
        await inquirer.prompt([
          {
            name: "name",
            message: "input project name",
          },
        ])
      ).name;
    } else {
      name = argv.name;
    }

    let path: string;
    if (argv.path) {
      path = argv.path;
    } else {
      path = name;
    }
    run(
      `git clone https://github.com/Yoshino-s/mirai-bot-template.git ${path}`
    );
    modify(join(path, "package.json"), (content) => {
      const pkg = JSON.parse(content);
      pkg.name = name;
      pkg.description = `Bot named ${name} based on mirai-bot`;
      return JSON.stringify(pkg, undefined, 2);
    });
    run(
      `cd ${path} && rm .git -rf && git init && git add . && git commit -m "init"`,
      true
    );

    run(`cd ${path} && yarn`);
  },
  {
    describe: "create new project",
    aliases: ["n", "init"],
  }
);

export = command;
