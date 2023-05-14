import { Express, Request, Response } from "express";
import database from '../core/database';
import logger from "../core/logger";
import { unknownErrorHandler } from "./util";

const getCohorts = async (request: Request, response: Response) => {
  const cohorts = database.getAllCohorts();
  response.status(200).send(cohorts);
}

const createCohort = async (request: Request, response: Response) => {  
  try {
    const { cohortName } = request.params;
    const cohorts = database.getAllCohorts();
    if (cohortName in cohorts) {
      response.statusMessage = "Cohort with that name already exists";
      response.status(400).send();
      return;
    }
    database.createCohort(cohortName);
    response.statusMessage = "Successfully created cohort";
    response.status(200).send();
  } catch (err: any) {
    response.statusMessage = err.message;
    response.status(500).send();
  }
}

// TODO - 404
// TODO - delete all data attached to cohort
const deleteCohort = async (request: Request, response: Response) => {
  const { cohortName } = request.params;
  if (!cohortName) {
    
  }
  database.deleteCohort(cohortName);
  response.statusMessage = "Successfully deleted cohort";
  response.status(200).send();

}

const updateCohort = async (request: Request, response: Response) => {

}


export const setupCohortsEndpoints = (app: Express) => {
  app.get('/cohorts', unknownErrorHandler(getCohorts))
  app.post('/cohorts/:cohortName', unknownErrorHandler(createCohort))
  app.delete('/cohorts/:cohortName', unknownErrorHandler(deleteCohort))
  app.patch('/cohorts/:cohortName', unknownErrorHandler(updateCohort))
}