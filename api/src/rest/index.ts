import logger from "../core/logger";
import { Express, Request, Response } from "express";
import cohortsApi from "./cohortsApi";
import jobsApi from "./jobsApi";
import subjectsApi from "./subjectsApi";
import qsm from "./qsmApi";
import { QSMXT_VERSION } from "../constants";

export const unknownErrorHandler = (func: (request: Request, response: Response) => Promise<any>) => async (request: Request, response: Response) => {
  try {
    await func(request, response);
  } catch (err) {
    logger.red(`Error occured in: ${func.name}`);
    if ((err as any).message) {
      logger.red((err as Error).message);
    } else {
      logger.red(err as any);
    }
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

export const setupRestApiEndpoint = (app: Express) => {
  app.get('/status', unknownErrorHandler(statusEndpoint));

  app.get('/cohorts', unknownErrorHandler(cohortsApi.get));
  app.post('/cohorts/:cohortName', unknownErrorHandler(cohortsApi.create));
  app.delete('/cohorts/:cohortName', unknownErrorHandler(cohortsApi.delete));
  app.patch('/cohorts/:cohortName', unknownErrorHandler(cohortsApi.update));

  app.get('/jobs/queue', unknownErrorHandler(jobsApi.queue.get));
  app.get('/jobs/history', unknownErrorHandler(jobsApi.history.get));

  app.get('/subjects', unknownErrorHandler((subjectsApi.get)));
  app.post('/subjects/dicom', unknownErrorHandler((subjectsApi.upload.dicom)));

  app.post('/qsm/run', unknownErrorHandler(qsm.run));
  app.get('/qsm/results', unknownErrorHandler(qsm.get));
}

