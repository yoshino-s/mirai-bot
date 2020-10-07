import * as ts from "typescript";
import * as changeCase from "change-case";

import { render } from "../tool/template.tool";
import { checkInPackage } from "../tool/check.tool";
import { generate, modify } from "../tool/fs.tool";
import { run } from "../tool/cmd.tool";

import Command from "./command";

const transformer = (name: string) => <T extends ts.Node>(
  context: ts.TransformationContext
) => (rootNode: T) => {
  function visit(node: ts.Node): ts.Node {
    node = ts.visitEachChild(node, visit, context);
    if (ts.isSourceFile(node)) {
      const statements = node.statements;
      const idx = statements.findIndex(
        (v, i) =>
          i === statements.length ||
          (v.kind === ts.SyntaxKind.ImportDeclaration &&
            statements[i + 1].kind !== ts.SyntaxKind.ImportDeclaration)
      );
      node = ts.updateSourceFileNode(node, [
        ...statements.slice(0, idx + 1),
        ts.createImportDeclaration(
          undefined,
          undefined,
          ts.createImportClause(
            undefined,
            ts.createNamedImports([
              ts.createImportSpecifier(
                undefined,
                ts.createIdentifier(`${changeCase.pascalCase(name)}Plugin`)
              ),
            ])
          ),
          ts.createLiteral(`./plugin/${changeCase.camelCase(name)}.plugin.ts`)
        ),
        ...statements.slice(idx + 1),
      ]);
    } else if (ts.isCallExpression(node)) {
      if (ts.isPropertyAccessExpression(node.expression)) {
        if (
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.escapedText === "bot" &&
          ts.isIdentifier(node.expression.name) &&
          node.expression.name.escapedText === "register"
        ) {
          node = ts.createCall(
            ts.createPropertyAccess(
              ts.createIdentifier("bot"),
              ts.createIdentifier("register")
            ),
            undefined,
            [
              ...node.arguments,
              ts.createIdentifier(`${changeCase.pascalCase(name)}Plugin`),
            ]
          );
        }
      }
    }
    return node;
  }
  return ts.visitNode(rootNode, visit);
};

function transform(sourceCode: string, name: string) {
  const source = ts.createSourceFile(
    "",
    sourceCode,
    ts.ScriptTarget.ES2016,
    true
  );
  const result = ts.transform(source, [transformer(name)]).transformed[0];
  const printer = ts.createPrinter();
  const resultCode = printer.printFile(result as ts.SourceFile);
  return resultCode;
}

const command = new Command(
  "plugin <name>",
  (yargs) => {
    return yargs.positional("name", {
      describe: "name of plugin",
      type: "string",
      demandOption: true,
    });
  },
  async (argv) => {
    try {
      checkInPackage(process.cwd());
      modify("src/main.ts", (content) => transform(content, argv.name));
      generate(
        `src/plugin/${changeCase.camelCase(argv.name)}.plugin.ts`,
        render("plugin", {
          name: `${changeCase.pascalCase(argv.name)}Plugin`,
        })
      );
      run("yarn lint", true);
      return;
    } catch (e) {
      //
    }
  },
  {
    describe: "add new plugin",
    aliases: ["p"],
  }
);

export = command;
