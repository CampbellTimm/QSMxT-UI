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
  await database.cohorts.delete(cohortName);
  // await database.deleteCohort(cohortName);
  response.statusMessage = "Successfully deleted cohort";
  response.status(200).send();

}

const updateCohort = async (request: Request, response: Response) => {
  const { cohortName } = request.params;
  console.log(cohortName);
  const { subjects } = request.body;
  if (!cohortName) {
    
  }
  const cohort = await database.cohorts.get.byName(cohortName);
  console.log(cohort);
  if (!cohort) {
    response.statusMessage = "The specified cohort does not exist";
    response.status(404).send();
    return;
  }
  const removedSubjects = cohort.subjects
    .filter(savedSubject => !(subjects as string[]).find(subject => subject == savedSubject));
  const newSubjects = (subjects as string[])
    .filter(subject => !cohort.subjects.find(savedSubject => savedSubject === subject));
  console.log(removedSubjects);
  console.log(newSubjects);

  await Promise.all([
    database.cohorts.remove.subjects(cohortName, removedSubjects),
    database.cohorts.add.subjects(cohortName, newSubjects),
  ])

  response.statusMessage = `Successfully updated cohort ${cohortName}`;
  response.status(200).send();
}


export default {
  get: getCohorts,
  create: createCohort,
  delete: deleteCohort,
  update: updateCohort
}