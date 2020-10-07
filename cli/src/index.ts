import yargs from "yargs";
import chalk from "chalk";

const banner = chalk`
{blue ┏━━━━━━━━━━━━━━━━━━━━━━━┓}
{blue ┃}{green ┏┳┓╻┏━┓┏━┓╻   ┏┓ ┏━┓╺┳╸}{blue ┃}
{blue ┃}{green ┃┃┃┃┣┳┛┣━┫┃╺━╸┣┻┓┃ ┃ ┃ }{blue ┃}
{blue ┃}{green ╹ ╹╹╹┗╸╹ ╹╹   ┗━┛┗━┛ ╹ }{blue ┃}
{blue ┗━━━━━━━━━━━━━━━━━━━━━━━┛}`.trim();

export function run() {
  yargs
    .commandDir("./command", {
      recurse: true,
      extensions: ["command.ts", "command.js"],
    })
    .help()
    .usage(banner)
    .demandCommand()
    .scriptName("mirai-bot")
    .version("2.1.0").argv;
}
