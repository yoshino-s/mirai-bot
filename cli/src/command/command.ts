import type { Argv } from "yargs";

export default class Command<O> {
  describe?: string | boolean;
  aliases?: string | string[];
  deprecated?: string | boolean;
  constructor(
    public readonly command: string,
    public readonly builder: (yargs: Argv) => Argv<O>,
    public readonly handler: (argv: O) => void,
    config: {
      describe?: string | false;
      aliases?: string | string[];
      deprecated?: boolean | string;
    } = {}
  ) {
    this.describe = config.describe;
    this.aliases = config.aliases;
    this.deprecated = config.deprecated;
  }
}
