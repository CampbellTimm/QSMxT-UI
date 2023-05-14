import { Express, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { DicomSortParameters, Job, JobParameters, JobStatus, JobType } from "../types";
import { unknownErrorHandler } from ".";
import database from "../database";

const getJobHistory = async (request: Request, response: Response) => {
  const history = await database.jobs.get.complete();
  response.status(200).send(history);
}

const getJobQueue = async (request: Request, response: Response) => {
  const history = await database.jobs.get.incomplete();
  response.status(200).send(history);
}

export default {
  history: {
    get: getJobHistory
  },
  queue: {
    get: getJobQueue
  }
}