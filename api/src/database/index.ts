import { Pool } from "pg";
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_USER } from "../constants";
import subjectsDto from './subjectsDto';
import jobsDto from './jobsDto';
import cohortsDto from './cohortsDto';
import logger from "../core/logger";

const databasePool = new Pool({
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  host: DATABASE_HOST,
  database: DATABASE_NAME
});

export const runDatabaseQuery = async (query: string) => {
  try {
    return databasePool.query(query);
  } catch (err) {
    logger.red(query);
    throw err;
  }
}

export default {
  subjects: subjectsDto,
  jobs: jobsDto,
  cohorts: cohortsDto
}