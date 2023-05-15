import { runDatabaseQuery } from ".";
import { COHORTS_FILE_PATH, COHORT_SUBJECTS_TABLE_NAME, COHORT_TABLE_NAME, JOBS_TABLE_NAME } from "../constants";
import logger from "../core/logger";
import { Cohort, Cohorts } from "../types";


const formatRowToCohort = (row: any) => {
  const subjects = row.subjects 
    ? row.subjects.split(',') 
    : [];
  return {
    subjects,
    description: row.description
  }
}

const getAllCohorts = async (): Promise<Cohorts> => {
  const response = await runDatabaseQuery(`
    SELECT A.cohort, A.description, COALESCE(string_agg(B.subject, ',' ORDER BY B.subject), '') as subjects
    FROM cohorts A
    LEFT JOIN cohortSubjects B ON A.cohort = B.cohort
    GROUP BY A.cohort;
  `);
  const cohorts: Cohorts = {};
  response.rows.forEach(row => {
    cohorts[row.cohort] = formatRowToCohort(row)
  })
  return cohorts;
}

// const getCohortByName = async (cohortName: string): Promise<Cohort | null> => {
//   const response = await runDatabaseQuery(`
//     SELECT * FROM cohorts 
//     WHERE cohort = '${cohortName}';
//   `);
//   return response.rows.length 
//     ? response.rows[0]
//     : null;
// }


const getCohortByName = async (cohortName: string): Promise<Cohort | null> => {
  const response = await runDatabaseQuery(`
    SELECT A.cohort, A.description, COALESCE(string_agg(B.subject, ',' ORDER BY B.subject), '') as subjects
    FROM cohorts A
    LEFT JOIN cohortSubjects B ON A.cohort = B.cohort
    WHERE A.cohort = '${cohortName}'
    GROUP BY A.cohort;
  `);
  return response.rows.length
    ? formatRowToCohort(response.rows[0])
    : null;
}

const doesCohortExist = async (cohortName: string): Promise<boolean> => {
  const response = await runDatabaseQuery(`
    SELECT * FROM cohorts 
    WHERE cohort = '${cohortName}';
  `);
  return !!response.rows.length;
}

// TODO - run parallel the first 2 calls
// TODO - dont delete jobs, just set to null
const deleteCohort = async (cohortName: string) => {
  const deleteJobsWithCohortQuery = `
    DELETE FROM ${JOBS_TABLE_NAME} 
    WHERE cohort = '${cohortName}'
  `;
  await runDatabaseQuery(deleteJobsWithCohortQuery);
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

const removeSubjects = async (cohortName: string, subjects: string[]) => {
  if (!subjects.length) {
    return;
  }
  const cohortConditions = subjects.map(subject => {
    return `subject = '${subject}'`
  })
  const removeSubjectsQuery = `
    DELETE FROM ${COHORT_SUBJECTS_TABLE_NAME} 
    WHERE cohort = '${cohortName}' AND ${cohortConditions.join(' OR ')}
  `;
  await runDatabaseQuery(removeSubjectsQuery);
}

const addSubjects = async (cohortName: string, subjects: string[]) => {
  if (!subjects.length) {
    return;
  }
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
    byName: getCohortByName
  },
  exists: doesCohortExist
}