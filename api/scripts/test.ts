import { Pool } from 'pg';

const pool = new Pool({
  user: 'user',
  password: 'password',
  host: 'localhost',
  database: 'user'
});


// const getAllCohorts = async (): Promise<any> => {
//   const x = await pool.query(`
//     SELECT A.cohort, string_agg(B.subject, ', ' ORDER BY B.subject)
//     FROM cohorts A
//     INNER JOIN cohortSubjects B ON A.cohort = B.cohort
//     GROUP BY A.cohort;
//   `);
//   console.log(x);
// }

const getAllCohorts = async (): Promise<any> => {
  const x = await pool.query(`
    SELECT A.cohort, COALESCE(string_agg(B.subject, ', ' ORDER BY B.subject), '') as subjects
    FROM cohorts A
    LEFT JOIN cohortSubjects B ON A.cohort = B.cohort
    GROUP BY A.cohort;
  `);
  console.log(x);
}

getAllCohorts().then();