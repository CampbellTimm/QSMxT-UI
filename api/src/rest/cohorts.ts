import {Express, Request, Response} from "express";
import fs from "fs";
import { COHORTS_FILE_PATH } from "../core/constants";

const getCohorts = async (request: Request, response: Response) => {
  const cohorts = JSON.parse(fs.readFileSync(COHORTS_FILE_PATH, { encoding: 'utf-8' }));
  response.status(200).send(cohorts);
}

const postCohorts = async (request: Request, response: Response) => {
  const cohorts = request.body;
  fs.writeFileSync(COHORTS_FILE_PATH, JSON.stringify(cohorts, null, 2));
  response.status(200).send();
}

export const setupCohortsEndpoints = (app: Express) => {
  app.get('/cohorts', getCohorts)
  app.post('/cohorts', postCohorts)
}