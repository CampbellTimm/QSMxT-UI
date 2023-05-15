import { Pool } from 'pg';

const pool = new Pool({
  user: 'qsmxt',
  password: 'password',
  host: 'localhost',
  database: 'qsmxt'
});

const dropTables = async () => {
  await pool.query(`
    DROP TABLE IF EXISTS jobs;
  `);
  console.log('Dropped table jobs');
  await pool.query(`
    DROP TABLE IF EXISTS cohortSubjects;
  `);
  console.log('Dropped table cohortSubjects');
  await pool.query(`
    DROP TABLE IF EXISTS cohorts;
  `);
  console.log('Dropped table cohorts');
  await pool.query(`
    DROP TABLE IF EXISTS subjects;
  `);
  console.log('Dropped table subjects');
}

const createSubjectsTable = async () => {
  await pool.query(`
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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cohorts (
      cohort TEXT,
      description TEXT,
      PRIMARY KEY (cohort)
    )
  `)
  console.log('Created table cohorts');
}

const createCohortSubjectsTable = async () => {
  await pool.query(`
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
  await pool.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id VARCHAR(100) PRIMARY KEY,
      subject TEXT NULL REFERENCES subjects(subject),
      cohort TEXT NULL REFERENCES cohorts(cohort),
      type VARCHAR(100) NOT NULL,
      status VARCHAR(100) NOT NULL,
      createdAt VARCHAR(100) NOT NULL,
      startedAt VARCHAR(100),
      finishedAt VARCHAR(100),
      parameters TEXT NOT NULL,
      error TEXT
    )
  `)
  console.log('Created table jobs');
}

(async () => {
  await dropTables();

  await createSubjectsTable();
  await createCohortsTable();
  await createCohortSubjectsTable();
  await createJobsTable();
  process.exit();

})()



