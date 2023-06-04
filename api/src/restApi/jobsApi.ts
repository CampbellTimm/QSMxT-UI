import { Request, Response } from "express";
import database from "../databaseClient";

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
  },
}