import fs from "fs";
import path from "path";

import chalk from "chalk";
import yaml from "yaml";
import ajv from "ajv";

import schema from "./config.schema.json";

export function checkInPackage(
  directory: string = process.cwd(),
  quiet = false
) {
  if (!quiet) console.log(chalk`{grey check if in mirai project}`);

  try {
    const pkg = path.join(directory, "package.json");
    if (JSON.parse(fs.readFileSync(pkg).toString())?.["mirai-bot"]?.version) {
      return true;
    }
  } catch (e) {
    //
  }
  console.error(chalk`{red Must run in a mirai-bot project}`);
  process.exit(1);
}

export function checkConfig(directory: string = process.cwd(), quiet = false) {
  if (!quiet) console.log(chalk`{grey check project config}`);

  try {
    const pkg = path.join(directory, "config.yml");
    const data = yaml.parse(fs.readFileSync(pkg).toString());
    const validate = ajv().compile(schema);
    if (validate(data)) {
      return true;
    } else {
      validate.errors?.forEach((e) => {
        console.error(e);
      });
    }
  } catch (e) {
    //
  }
  console.error(chalk`{red Wrong project config}`);
  process.exit(1);
}
