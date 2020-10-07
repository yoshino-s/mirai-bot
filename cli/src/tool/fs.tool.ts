import fs from "fs";
import path from "path";

import chalk from "chalk";

export function modify(
  filePath: string,
  cb: (content: string) => string,
  quiet = false
) {
  if (!quiet) console.log(chalk`{grey modify file ${filePath}}`);
  fs.writeFileSync(filePath, cb(fs.readFileSync(filePath).toString()));
}

export function generate(filePath: string, content: string, quiet = false) {
  if (!quiet) console.log(chalk`{grey create file ${filePath}}`);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

export function fallRead(...paths: string[]) {
  return paths.reduce((content, path) => {
    try {
      return fs.readFileSync(path).toString();
    } catch (e) {
      console.log(path);
      return "";
    }
  }, "");
}
