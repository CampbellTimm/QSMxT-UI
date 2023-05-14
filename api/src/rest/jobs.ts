import { Express, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { DicomSortParameters, Job, JobParameters, JobStatus, JobType } from "../core/types";
import database from "../core/database";
import { unknownErrorHandler } from "./util";

const getJobsQueue = async (request: Request, response: Response) => {
  const jobQueue = database.getIncompleteJobs();
  return response.status(200).send(jobQueue);
}

export const setuJobsEndpoints = (app: Express) => {
  app.get('/jobs/queue', unknownErrorHandler(getJobsQueue))
  app.get('/jobs/history', unknownErrorHandler(getJobsQueue))
}

