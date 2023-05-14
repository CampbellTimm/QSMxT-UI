import { Express, Request, Response } from "express";
import database from '../database';
import logger from "../core/logger";
import { unknownErrorHandler } from ".";

const getCohorts = async (request: Request, response: Response) => {
  const cohorts = await database.cohorts.get.all();
  response.status(200).send(cohorts);
}

const createCohort = async (request: Request, response: Response) => {  
  try {
    const { cohortName } = request.params;
    const { cohortDescription } = request.body;
    const alreadyExists = await database.cohorts.exists(cohortName);
    if (alreadyExists) {
      response.statusMessage = "Cohort with that name already exists";
      response.status(400).send();
      return;
    }
    await database.cohorts.save(cohortName, cohortDescription);
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
  // await database.deleteCohort(cohortName);
  response.statusMessage = "Successfully deleted cohort";
  response.status(200).send();

}

const updateCohort = async (request: Request, response: Response) => {

}


export default {
  get: getCohorts,
  create: createCohort,
  delete: deleteCohort,
  update: updateCohort
}