import { JOBS_TABLE_NAME } from "../constants";
import { Job, JobStatus, JobType } from "../types"
import { runDatabaseQuery } from ".";

const formatRowsToJobs = (jobs: any[]): Job[] => {
  return jobs.map(job => ({
    id: job.id,
    subject: job.subject,
    cohort: job.cohort,
    type: job.type,
    status: job.status,
    createdAt: job.createdat,
    startedAt: job.startedat,
    finishedAt: job.finishedAt,
    parameters: JSON.parse(job.parameters),
    error: job.error
  })) as Job[]
}

const getIncompleteJobs = async (): Promise<Job[]> => {
  const query = `
    SELECT * FROM ${JOBS_TABLE_NAME} 
    WHERE status = '${JobStatus.NOT_STARTED}' OR status = '${JobStatus.IN_PROGRESS}'
    ORDER BY createdAt ASC;
  `;
  const response = await runDatabaseQuery(query);
  return formatRowsToJobs(response.rows) as Job[];
}

const getCompleteJobs = async (): Promise<Job[]> => {
  const query = `
    SELECT * FROM ${JOBS_TABLE_NAME} 
    WHERE status = '${JobStatus.COMPLETE}' OR status = '${JobStatus.FAILED}'
    ORDER BY finishedat ASC;
  `;
  const response = await runDatabaseQuery(query);
  return formatRowsToJobs(response.rows) as Job[];
}

const updateJob = async (job: Job): Promise<void> => {
  const startedAt = job.startedAt ? `'${job.startedAt}'` : 'NULL'
  const finishedAt = job.finishedAt ? `'${job.finishedAt}'` : 'NULL'
  const error = job.error ? `'${job.error}'` : 'NULL'
  const query = `
    UPDATE ${JOBS_TABLE_NAME} 
    SET status = '${job.status}', startedAt = ${startedAt}, finishedAt = ${finishedAt}, error = ${error}
    WHERE id = '${job.id}'
  `;
  await runDatabaseQuery(query);
}

const saveJob = async (job: Job) => {
  const subject = job.subject ? `'${job.subject}'` : 'NULL';
  const cohort = job.cohort ? `'${job.cohort}'` : 'NULL';
  const { id, type, status, createdAt, parameters } = job;
  const query = `
    INSERT INTO ${JOBS_TABLE_NAME} (id, subject, cohort, type, status, createdAt, parameters)
    VALUES ('${id}', ${subject}, ${cohort}, '${type}', '${status}', '${createdAt}', '${JSON.stringify(parameters)}');
  `;
  await runDatabaseQuery(query);
}

const deleteIncompleteJobs = async () => {
  const query = `
    DELETE FROM ${JOBS_TABLE_NAME} 
    WHERE status = '${JobStatus.IN_PROGRESS}' OR status = '${JobStatus.NOT_STARTED}'
  `;
  await runDatabaseQuery(query);
}

const getQsmJobs = async () => {
  const query = `
    SELECT * FROM ${JOBS_TABLE_NAME} 
    WHERE type = '${JobType.QSM}' AND status = '${JobStatus.COMPLETE}'
  `;
  const response = await runDatabaseQuery(query);
  return formatRowsToJobs(response.rows) as Job[];
}

export default {
  get: {
    incomplete: getIncompleteJobs,
    complete: getCompleteJobs,
    qsm: getQsmJobs
  },
  update: updateJob,
  save: saveJob,
  delete: {
    incomplete: deleteIncompleteJobs
  }
}