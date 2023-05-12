import { Express, Request, Response } from "express";
import { readCohortsData, saveCohortsData } from "../util/data";

const getCohorts = async (request: Request, response: Response) => {
  const cohorts = readCohortsData();
  response.status(200).send(cohorts);
}

const postCohorts = async (request: Request, response: Response) => {
  const cohorts = request.body;
  saveCohortsData(cohorts);
  response.status(200).send();
}

const createCohort = (request: Request, response: Response) => {  
  try {
    const { cohortName } = request.params;
    const cohorts = readCohortsData();
    if (cohortName in cohorts) {
      response.statusMessage = "Cohort with that name already exists";
      response.status(400).send();
      return;
    }
    const updatedCohorts = Object.assign({}, cohorts, {[cohortName]: []});
    saveCohortsData(updatedCohorts);
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
  const cohorts = readCohortsData();
  delete cohorts[cohortName];
  saveCohortsData(cohorts);
  response.statusMessage = "Successfully deleted cohort";
  response.status(200).send();

}

const updateCohort = async (request: Request, response: Response) => {

}

export const setupCohortsEndpoints = (app: Express) => {
  app.get('/cohorts', getCohorts)
  app.post('/cohorts', postCohorts)
  app.post('/cohorts/:cohortName', createCohort)
  app.delete('/cohorts/:cohortName', deleteCohort)
  app.patch('/cohorts/:cohortName', updateCohort)
}