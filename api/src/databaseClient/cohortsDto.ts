import { runDatabaseQuery, runDatabaseQuery2 } from ".";
import { COHORT_SUBJECTS_TABLE_NAME, COHORT_TABLE_NAME, JOBS_TABLE_NAME } from "../constants";
import logger from "../util/logger";
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
  // const query = `
  //   SELECT A.cohort, A.description, COALESCE(string_agg(B.subject, ',' ORDER BY B.subject), '') as subjects
  //   FROM ${COHORT_TABLE_NAME} A
  //   LEFT JOIN cohortSubjects B ON A.cohort = B.cohort
  //   GROUP BY A.cohort;
  // `;
  const query = `
    SELECT *
    FROM ${COHORT_TABLE_NAME};
  `
  const response = await runDatabaseQuery(query);

  const cohorts: Cohorts = {};

  await Promise.all(response.map(async (row: any) => {
    const query = `
      SELECT * 
      FROM cohortSubjects
      WHERE cohort = '${row.cohort}'
    `
    const response = await runDatabaseQuery(query);
    const subjects = response.map((x: any) => x.subject)
    cohorts[row.cohort] = {
      subjects,
      description: row.description
    }
  }))

    // @ts-ignore
  // response.forEach(row => {
  //   cohorts[row.cohort] = formatRowToCohort(row)
  // })
  return cohorts;
}

const getCohortByName = async (cohortName: string): Promise<Cohort | null> => {
  // const response = await runDatabaseQuery(`
  //   SELECT A.cohort, A.description, COALESCE(string_agg(B.subject, ',' ORDER BY B.subject), '') as subjects
  //   FROM ${COHORT_TABLE_NAME} A
  //   LEFT JOIN cohortSubjects B ON A.cohort = B.cohort
  //   WHERE A.cohort = '${cohortName.replace(/'/g, "''")}'
  //   GROUP BY A.cohort;
  // `);
  const cohorts: any = await getAllCohorts();
  const cohort = cohorts[cohortName];
  return cohort
    ? cohort
    : null;
}

const doesCohortExist = async (cohortName: string): Promise<boolean> => {
  const response = await runDatabaseQuery(`
    SELECT * FROM ${COHORT_TABLE_NAME} 
    WHERE cohort = '${cohortName.replace(/'/g, "''")}';
  `);
  return !!response.length;
}

const deleteCohort = async (cohortName: string) => {
  const deleteSubjectsInCohortQuery = `
    DELETE FROM ${COHORT_SUBJECTS_TABLE_NAME} 
    WHERE cohort = '${cohortName.replace(/'/g, "''")}'
  `;
  await runDatabaseQuery2(deleteSubjectsInCohortQuery);
  const deleteCohortQuery = `
    DELETE FROM ${COHORT_TABLE_NAME} 
    WHERE cohort = '${cohortName.replace(/'/g, "''")}'
  `;
  await runDatabaseQuery2(deleteCohortQuery);
}

const saveCohort = async (cohortName: string, description: string) => {
  const query = `
    INSERT INTO ${COHORT_TABLE_NAME} (cohort, description)
    VALUES ('${cohortName.replace(/'/g, "''")}', '${description}');
  `;
  await runDatabaseQuery2(query);
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
    WHERE cohort = '${cohortName.replace(/'/g, "''")}' AND ${cohortConditions.join(' OR ')}
  `;
  await runDatabaseQuery2(removeSubjectsQuery);
}

const addSubjects = async (cohortName: string, subjects: string[]) => {
  if (!subjects.length) {
    return;
  }
  const insertValues = subjects.map(subject => {
    return `('${cohortName.replace(/'/g, "''")}', '${subject}')`
  });
  const query = `
    INSERT INTO ${COHORT_SUBJECTS_TABLE_NAME} (cohort, subject)
    VALUES ${insertValues.join(', ')};
  `;
  await runDatabaseQuery2(query);
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