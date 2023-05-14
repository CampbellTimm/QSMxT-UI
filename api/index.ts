import { createServer } from "./src/core/createServer";
import database from "./src/core/database";
import logger from "./src/core/logger";
import { killChildProcess } from "./src/service/childProcess";

if (process.env.DEBUG === 'true') {
  logger.yellow("Debug Mode: wiping queue")
  database.deleteIncompleteJobs();
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