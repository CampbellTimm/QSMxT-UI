import { JOBS_TABLE_NAME } from "../constants";
import { Job, JobStatus, JobType } from "../types"
import { runDatabaseQuery } from ".";

const lowerCaseToCamelCase: {[key: string]: string} = {
  createdat: 'createdAt',
  startedat: 'startedAt',
  finishedat: 'finishedAt',
  linkedqsmjob: 'linkedQsmJob',
  segmentationfinishedat: 'segmentationFinishedAt',
  segmentationcreatedat: 'segmentationCreatedAt',
  qsmfinishedat: 'qsmFinishedAt'
}

const formatRowsToJobs = (jobs: any[]): Job[] => {
  return jobs.map(job => {
    const formattedJob: any = {};
    Object.keys(job).forEach(key => {
      if (key === 'parameters') {
        formattedJob.parameters = JSON.parse(job.parameters);
      } else if (key in lowerCaseToCamelCase) {
        formattedJob[lowerCaseToCamelCase[key]] = job[key];
      } else {
        formattedJob[key] = job[key];
      }
    })
    return formattedJob as Job;
  }) as Job[]
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
    ORDER BY finishedat DESC;
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
  const linkedQsmJob = job.linkedQsmJob ? `'${job.linkedQsmJob}'` : 'NULL';
  const description = job.description ? `'${job.description}'` : 'NULL';
  const { id, type, status, createdAt, parameters } = job;
  const query = `
    INSERT INTO ${JOBS_TABLE_NAME} (id, type, status, createdAt, parameters, linkedQsmJob, description)
    VALUES ('${id}', '${type}', '${status}', '${createdAt}', '${JSON.stringify(parameters)}', ${linkedQsmJob}, ${description});
  `;
  await runDatabaseQuery(query);
}

const getInProgressJobs = async () => {
  const query = `
    SELECT *
    FROM ${JOBS_TABLE_NAME} 
    WHERE status = '${JobStatus.IN_PROGRESS}'
  `;
  const response =await runDatabaseQuery(query);
  return formatRowsToJobs(response.rows) as Job[];
}

const getCompleteQsmJobs = async () => {
  const query = `
    SELECT A.id, A.description, A.startedAt, A.finishedAt AS qsmFinishedAt, B.finishedAt AS segmentationFinishedAt, B.createdat AS segmentationCreatedAt, A.parameters
    FROM ${JOBS_TABLE_NAME} A
    LEFT JOIN ${JOBS_TABLE_NAME} B ON A.id = B.linkedqsmjob AND B.type = '${JobType.SEGMENTATION}'
    WHERE A.type = '${JobType.QSM}'
  `;
  const response = await runDatabaseQuery(query);
  return formatRowsToJobs(response.rows) as Job[];
}

export default {
  get: {
    incomplete: getIncompleteJobs,
    complete: getCompleteJobs,
    inProgess: getInProgressJobs,
    qsmResults: getCompleteQsmJobs,
  },
  update: updateJob,
  save: saveJob,
  delete: {  }
}