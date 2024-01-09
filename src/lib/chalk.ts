import chalk from "chalk";

chalk.level = 1;

export const $chalk = {
  success: chalk.green,
  error: chalk.whiteBright.bgRed,
  info: chalk.cyan,
  warn: chalk.yellow,
  muted: chalk.gray,
};
