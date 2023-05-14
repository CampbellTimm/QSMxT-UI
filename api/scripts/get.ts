import { Pool } from 'pg';

const pool = new Pool({
  user: 'user',
  password: 'password',
  host: 'localhost',
  database: 'user'
});

(async () => {
  const subjects = await pool.query(`
    SELECT * FROM subjects
  `);
  console.log('Subjects')
  console.log(subjects.rows);
  const cohorts = await pool.query(`
    SELECT * FROM cohorts
  `);
  console.log('Cohorts')
  console.log(cohorts.rows);  
  const cohortSubjects = await pool.query(`
    SELECT * FROM cohortSubjects
  `);
  console.log('Cohort subjects')
  console.log(cohortSubjects.rows); 
  const jobs = await pool.query(`
    SELECT * FROM jobs
  `);
  console.log('Jobs');
  console.log(jobs.rows);
  process.exit();
})()
