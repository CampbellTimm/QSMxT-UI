import path from "path";

const projectRootPath = process.cwd();

export const SERVER_PORT = 4000;
export const TEMP_FILE_DIRECTORY = path.join(projectRootPath, './tmp');
export const DICOMS_FOLDER = path.join(projectRootPath, `./public/qsmxt/dicoms`);
export const COHORTS_FILE_PATH = path.join(projectRootPath, "./public/qsmxt/cohorts.json");
export const BIDS_FOLDER = path.join(projectRootPath, `./public/qsmxt/bids`);
export const QSM_FOLDER = path.join(projectRootPath, `./public/qsmxt/qsm`);
export const COHORTS_TREE_PATH = path.join(projectRootPath, './public/qsmxt/cohorts.json');
export const JOBS_FILE_PATH = path.join(projectRootPath, './public/qsmxt/jobs.json');
export const QSMXT_VERSION = '2.1.0';
export const QSMXT_DATE = '20230509';
export const DATABASE_USER = 'user';
export const DATABASE_PASSWORD = 'password';
export const DATABASE_NAME = 'user';
export const DATABASE_HOST = 'localhost';
export const SUBJECT_TABLE_NAME = 'subjects';
export const JOBS_TABLE_NAME = 'jobs';
export const COHORT_TABLE_NAME = 'cohorts';
export const COHORT_SUBJECTS_TABLE_NAME = 'cohortSubjects';