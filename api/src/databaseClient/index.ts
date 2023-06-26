import { Pool } from "pg";
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER } from "../constants";
import subjectsDto from './subjectsDto';
import jobsDto from './jobsDto';
import cohortsDto from './cohortsDto';
import logger from "../util/logger";
import { spawn } from "child_process";
import { setupListeners } from "../qsmxtInstanceHandler";
import * as sqlite3 from 'sqlite3';
import path from "path";

const databasepath = path.join(process.cwd() + '/public/database/database');
const db: sqlite3.Database = new sqlite3.Database(databasepath);

export const runDatabaseQuery2 = async (query: string): Promise<any> => {
  try {
    await new Promise((resolve, reject) => {
      db.run(query, (err: any) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(null);
        }
      });
    })
  } catch (err) {
    logger.red(query);
    throw err;
  }
}

export const runDatabaseQuery = async (query: string): Promise<any> => {
  try {
    return await new Promise((resolve, reject) => {
      db.all(query, (err: any, rows: any) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(rows);
        }
      });
    })
  } catch (err) {
    logger.red(query);
    throw err;
  }
}

const createSubjectsTable = async () => {
  await runDatabaseQuery2(`
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
  await runDatabaseQuery2(`
    CREATE TABLE IF NOT EXISTS cohorts (
      cohort TEXT,
      description TEXT,
      PRIMARY KEY (cohort)
    )
  `)
  console.log('Created table cohorts');
}

const createCohortSubjectsTable = async () => {
  await runDatabaseQuery2(`
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
const createJobsTable = async () => {
  await runDatabaseQuery2(`
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

// const startDatabase = async () => {
//   const databaseInitiator: any = spawn('sudo', ['service',  'postgresql', 'start']);
//   await new Promise((resolve, reject) => {
//     setupListeners(databaseInitiator,reject);
//     databaseInitiator.stdout.on('data', (data: any) => {
//       if (data.toString().includes('done')) {
//         resolve(null);
//       }
//     });
//   })
//   databaseInitiator.kill();
//   logger.green('Started database');
// }

const setupDatabase = async () => {
  // await startDatabase();
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