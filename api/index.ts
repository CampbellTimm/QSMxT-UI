import restApi from "./src/restApi";
import databaseClient from "./src/databaseClient";
import logger from "./src/util/logger";
import qsmxtInstanceHandler from "./src/qsmxtInstanceHandler";
import { BIDS_FOLDER, DICOMS_FOLDER, LOGS_FOLDER, QSM_FOLDER } from "./src/constants";
import fs from "fs";
import { JobStatus } from "./src/types";
import jobHandler from "./src/jobHandler";

const delteInProgessJobs = async () => {
  const inProgessJobs = await databaseClient.jobs.get.incomplete();
  if (inProgessJobs.length) {
    inProgessJobs.map(async (job) => {
      await databaseClient.jobs.update({
        ...job,
        status: JobStatus.FAILED,
        finishedAt: new Date().toISOString(),
        error: 'API closed during progress. Marking as failed'
      })
    })
  }
}

const setup = async () => {
  try {
    const serverPromise = restApi.create();
    const databaseSetupPromise = databaseClient.setup();
    [DICOMS_FOLDER, BIDS_FOLDER, QSM_FOLDER, LOGS_FOLDER].forEach((folder: string) => {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
    });
    const server = await serverPromise;
    await databaseSetupPromise;
    await Promise.all([jobHandler.setup(server), delteInProgessJobs()])
    restApi.setStatus('ok');
    logger.green("Completed Setup");
  } catch (err) {
    console.log(err);
  }
}

const cleanup = async () => {
  qsmxtInstanceHandler.killChildProcess();
  console.log('Exiting Program');
  process.exit();
}

setup().then();

process.on('exit', () => cleanup);
process.on('SIGINT', cleanup);
process.on('SIGUSR2', cleanup);