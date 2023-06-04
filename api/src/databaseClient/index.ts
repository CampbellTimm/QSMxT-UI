import { Pool } from "pg";
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER } from "../constants";
import subjectsDto from './subjectsDto';
import jobsDto from './jobsDto';
import cohortsDto from './cohortsDto';
import logger from "../util/logger";
import { spawn } from "child_process";
import { setupListeners } from "../qsmxtInstanceHandler";

const databasePool = new Pool({
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  database: DATABASE_NAME
});

export const runDatabaseQuery = async (query: string) => {
  try {
    return await databasePool.query(query);
  } catch (err) {
    logger.red(query);
    throw err;
  }
}

const createSubjectsTable = async () => {
  await runDatabaseQuery(`
    CREATE TABLE IF NOT EXISTS subjects (
      subject TEXT PRIMARY KEY,
      dataTree TEXT NOT NULL,
      uploadFormat VARCHAR(100) NOT NULL,
      parameters TEXT
    )
  `);
  console.log('Created table subjects');
}

const createCohortsTable = async () => {
  await runDatabaseQuery(`
    CREATE TABLE IF NOT EXISTS cohorts (
      cohort TEXT,
      description TEXT,
      PRIMARY KEY (cohort)
    )
  `)
  console.log('Created table cohorts');
}

const createCohortSubjectsTable = async () => {
  await runDatabaseQuery(`
    CREATE TABLE IF NOT EXISTS cohortSubjects (
      cohort TEXT,
      subject TEXT,
      PRIMARY KEY (cohort, subject),
      FOREIGN KEY (subject) REFERENCES subjects(subject),
      FOREIGN KEY (cohort) REFERENCES cohorts(cohort)
    )
  `)
  console.log('Created table cohortSubjects');
}

// TODO - remove cohort
const createJobsTable = async () => {
  await runDatabaseQuery(`
    CREATE TABLE IF NOT EXISTS jobs (
      id VARCHAR(100) PRIMARY KEY,
      description TEXT,
      type VARCHAR(100) NOT NULL,
      status VARCHAR(100) NOT NULL,
      createdAt VARCHAR(100) NOT NULL,
      startedAt VARCHAR(100),
      finishedAt VARCHAR(100),
      parameters TEXT NOT NULL,
      error TEXT,
      linkedQsmJob VARCHAR(100) REFERENCES jobs(id)
    )
  `)
  console.log('Created table jobs');
}

const startDatabase = async () => {
  const databaseInitiator: any = spawn('sudo', ['service',  'postgresql', 'start']);
  await new Promise((resolve, reject) => {
    setupListeners(databaseInitiator,reject);
    databaseInitiator.stdout.on('data', (data: any) => {
      if (data.toString().includes('done')) {
        resolve(null);
      }
    });
  })
  databaseInitiator.kill();
  logger.green('Started database');
}

const setupDatabase = async () => {
  await startDatabase();
  await createSubjectsTable();
  await createCohortsTable();
  await createCohortSubjectsTable();
  await createJobsTable();
}

export default {
  subjects: subjectsDto,
  jobs: jobsDto,
  cohorts: cohortsDto,
  setup: setupDatabase
}