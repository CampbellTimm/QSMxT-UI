import { createRestApi } from "./src/rest";
import database, { setupDatabase } from "./src/database";
import logger from "./src/util/logger";
import { killChildProcess } from "./src/qsmxt";
import { BIDS_FOLDER, DICOMS_FOLDER, QSM_FOLDER } from "./src/constants";
import fs from "fs";

const setup = async () => {
  // await setupDatabase();

  if (process.env.DEBUG === 'true') {
    logger.yellow("Debug Mode: wiping queue")
    database.jobs.delete.incomplete().then();
  }

  [DICOMS_FOLDER, BIDS_FOLDER, QSM_FOLDER].forEach((folder: string) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  });  
  
  await createRestApi();

  logger.green("Done Setup");
}


const cleanup = () => {
  killChildProcess();
  console.log('Exiting Program');
  process.exit();
}

setup().then();

process.on('exit', () => cleanup);
process.on('SIGINT', cleanup);
process.on('SIGUSR2', cleanup);