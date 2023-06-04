import { Request, Response } from "express";
import database from '../databaseClient';

const getCohorts = async (request: Request, response: Response) => {
  const cohorts = await database.cohorts.get.all();
  response.status(200).send(cohorts);
}

const createCohort = async (request: Request, response: Response) => {  
  try {
    const cohortName = decodeURIComponent(request.params.cohortName);
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

const deleteCohort = async (request: Request, response: Response) => {
  const { cohortName } = request.params;
  const cohortExists = await database.cohorts.exists(cohortName);
  if (!cohortExists) {
    response.statusMessage = "Cohort does not exist";
    response.status(400).send();
    return;
  }
  await database.cohorts.delete(cohortName);
  response.statusMessage = "Successfully deleted cohort";
  response.status(200).send();
}

const updateCohort = async (request: Request, response: Response) => {
  const { cohortName } = request.params;
  const { subjects } = request.body;
  const cohort = await database.cohorts.get.byName(cohortName);
  if (!cohort) {
    response.statusMessage = "Cohort does not exist";
    response.status(404).send();
    return;
  }
  const removedSubjects = cohort.subjects
    .filter(savedSubject => !(subjects as string[]).find(subject => subject == savedSubject));
  const newSubjects = (subjects as string[])
    .filter(subject => !cohort.subjects.find(savedSubject => savedSubject === subject));

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