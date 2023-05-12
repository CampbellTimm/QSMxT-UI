import fs from "fs";
import { COHORTS_FILE_PATH } from "../core/constants";


export const readCohortsData = () => {
  return JSON.parse(fs.readFileSync(COHORTS_FILE_PATH, { encoding: 'utf-8' }));
}

export const saveCohortsData = (cohorts: any) => {
  fs.writeFileSync(COHORTS_FILE_PATH, JSON.stringify(cohorts, null, 2));
}