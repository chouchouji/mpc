#!/usr/bin/env node
import { cac } from "cac";
import colors from "picocolors";
import { exec } from "node:child_process";
import nodePath from "node:path";

const cli = cac("mpc");

cli
  .command("")
  .option(
    "--platform <platform>",
    "Specify the platform to open (e.g. weixin, alipay, toutiao)"
  )
  .option("--devtool-path <devtoolPath>", "Path to the WeChat DevTools CLI")
  .option("--path [path]", "Path to the dist directory")
  .action(({ path, platform, devtoolPath }) => {
    if (!platform) {
      console.log(
        colors.yellow("Please specify the platform using --platform option")
      );
      return;
    }
    const isDev = process.env.NODE_ENV === "development";
    const distPath = (isDev ? "dev" : "build") + "/mp/" + platform;
    if (!path) {
      path = nodePath.resolve(process.cwd(), distPath);
    }

    const command = `"${devtoolPath}" --open "${path}"`;
    exec(command, (error, _, stderr) => {
      if (error || stderr) {
        console.log(colors.red(error?.message || stderr));
        return;
      }

      console.log(colors.green(`Open successfully!`));
    });
  });

cli.help();
cli.version(require("./package.json").version);
cli.parse();
