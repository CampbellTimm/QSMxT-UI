import { runDatabaseQuery } from ".";
import { COHORTS_FILE_PATH, COHORT_SUBJECTS_TABLE_NAME, COHORT_TABLE_NAME } from "../constants";
import logger from "../core/logger";
import { Cohorts } from "../types";

const getAllCohorts = async (): Promise<Cohorts> => {
  const response = await runDatabaseQuery(`
    SELECT A.cohort, A.description, COALESCE(string_agg(B.subject, ',' ORDER BY B.subject), '') as subjects
    FROM cohorts A
    LEFT JOIN cohortSubjects B ON A.cohort = B.cohort
    GROUP BY A.cohort;
  `);
  const cohorts: Cohorts = {};
  response.rows.forEach(row => {
    const subjects = row.subjects 
    ? row.subjects.split(',') 
    : [];
    cohorts[row.cohort] = {
      subjects,
      description: row.description
    }
  })
  return cohorts;
}

const doesCohortExist = async (cohortName: string): Promise<boolean> => {
  const response = await runDatabaseQuery(`
    SELECT * FROM cohorts 
    WHERE cohort =' ${cohortName}';
  `);
  return !!response.rows.length;
}

const deleteCohort = async (cohortName: string) => {
  const deleteSubjectsInCohortQuery = `
    DELETE FROM ${COHORT_SUBJECTS_TABLE_NAME} 
    WHERE cohort = '${cohortName}'
  `;
  await runDatabaseQuery(deleteSubjectsInCohortQuery);
  const deleteCohortQuery = `
    DELETE FROM ${COHORT_TABLE_NAME} 
    WHERE cohort = '${cohortName}'
  `;
  await runDatabaseQuery(deleteCohortQuery);
}

const saveCohort = async (cohortName: string, description: string) => {
  const query = `
    INSERT INTO ${COHORT_TABLE_NAME} (cohort, description)
    VALUES ('${cohortName}', '${description}');
  `;
  await runDatabaseQuery(query);
}

const removeSubjects = async (cohortName: string, subjects: string[] ) => {
  const query = `
    INSERT INTO ${COHORT_TABLE_NAME} (cohort, description)
    VALUES ('${cohortName}', '${subjects}')
  `;
  await runDatabaseQuery(query);
}

const addSubjects = async (cohortName: string, subjects: string[]) => {
  const insertValues = subjects.map(subject => {
    return `('${cohortName}', '${subject}')`
  });
  const query = `
    INSERT INTO ${COHORT_SUBJECTS_TABLE_NAME} (cohort, subject)
    VALUES ${insertValues.join(', ')};
  `;
  await runDatabaseQuery(query);
}

export default {
  save: saveCohort,
  delete: deleteCohort,
  add: {
    subjects: addSubjects
  },
  remove: {
    subjects: removeSubjects
  },
  get: {
    all: getAllCohorts,
  },
  exists: doesCohortExist
}