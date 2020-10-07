import { join } from "path";

import ejs from "ejs";

import { fallRead } from "./fs.tool";

export function render(fileName: string, data: any) {
  const template = fallRead(
    join(__dirname, `../template/${fileName}.template.ejs`)
  );
  return ejs.render(template, data);
}
