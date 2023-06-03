import logger from "../util/logger";
import { Express, Request, Response } from "express";
import cohortsApi from "./cohortsApi";
import jobsApi from "./jobsApi";
import subjectsApi from "./subjectsApi";
import qsm from "./qsmApi";
import express from "express";
import path from "path";
import cors from "cors";
import { BIDS_FOLDER, DICOMS_FOLDER, QSM_FOLDER, SERVER_PORT } from "../constants";
import http from "http";
import fs from "fs";
import sockets from "../jobHandler/sockets";

const wipeLogFiles = (folder: string) => {
  const files = fs.readdirSync(folder);
  files.forEach(fileName => {
    if (fileName.startsWith('log_') || fileName.startsWith('references')) {
      fs.unlinkSync(path.join(folder, fileName));
    }
  })
}

export const unknownErrorHandler = (func: (request: Request, response: Response) => Promise<any>) => async (request: Request, response: Response) => {
  try {
    await func(request, response);
  } catch (err) {
    logger.red(`Error occured in: ${func.name}`);
    if ((err as any).message) {
      logger.red((err as Error).message);
    }
    logger.red(err as any);
    
    response.statusMessage = "Unknown error occured";
    response.status(500).send();
  }
}

const statusEndpoint = async (request: Request, response: Response) => {
  const data = {
    status: 'ok'
  }
  response.status(200).send(data);
}

export const setupRestApiEndpoints = (app: Express) => {
  app.get('/status', unknownErrorHandler(statusEndpoint));
  app.get('/cohorts', unknownErrorHandler(cohortsApi.get));
  app.post('/cohorts/:cohortName', unknownErrorHandler(cohortsApi.create));
  app.delete('/cohorts/:cohortName', unknownErrorHandler(cohortsApi.delete));
  app.patch('/cohorts/:cohortName', unknownErrorHandler(cohortsApi.update));
  app.get('/jobs/queue', unknownErrorHandler(jobsApi.queue.get));
  app.get('/jobs/history', unknownErrorHandler(jobsApi.history.get));
  app.get('/subjects', unknownErrorHandler((subjectsApi.get)));
  app.post('/subjects/dicom', unknownErrorHandler((subjectsApi.upload.dicom)));
  app.post('/subjects/bids', unknownErrorHandler((subjectsApi.upload.bids)));
  app.post('/qsm/run', unknownErrorHandler(qsm.run));
  app.get('/qsm/results', unknownErrorHandler(qsm.get));
}

export const createRestApi = async () => {
  [QSM_FOLDER, BIDS_FOLDER, DICOMS_FOLDER].forEach(wipeLogFiles);
  const app = express();
  app.use(express.json());
  app.use(cors())
  app.use(express.static(path.join(process.cwd(), 'public')));
  setupRestApiEndpoints(app);
  const server = http.createServer(app);
  await sockets.setup(server);
  server.listen(SERVER_PORT, () => {
    logger.green(`Server started on port ${SERVER_PORT}`);
  });
}
