import { createServer } from "./src/core/server";
import database from "./src/database";
import logger from "./src/core/logger";
import { killChildProcess } from "./src/qsmxt";

if (process.env.DEBUG === 'true') {
  logger.yellow("Debug Mode: wiping queue")
  database.jobs.delete.incomplete().then();
}

createServer();

const cleanup = () => {
  killChildProcess();
  console.log('Exiting Program');
  process.exit();
}

process.on('exit', () => cleanup);
process.on('SIGINT', cleanup);
process.on('SIGUSR2', cleanup);