import axios from "axios";
import { reduceEachTrailingCommentRange } from "typescript";
import { Cohorts, QueueJob, SubjectsTree } from "./types";

const API_URL = 'http://127.0.0.1:4000'

export const getCohorts = async (): Promise<Cohorts> => {
  const getCohortPath = API_URL + '/cohorts';
  const response = await fetch(getCohortPath, {
    headers: {
      "Access-Control-Request-Private-Network": "true"
    }
  });
  const data: any = await response.json();
  return data as Cohorts;
}

export const postCohorts = async (cohorts: Cohorts): Promise<void> => {
  const getCohortPath = API_URL + '/cohorts';
  // await axios.post(getCohortPath, cohorts);
  await axios.post(getCohortPath, cohorts);
}

export const getSubjects = async (): Promise<SubjectsTree> => {
  const getSubjectsPath = API_URL + '/subjects';
  const response = await fetch(getSubjectsPath, {
    headers: {
      "Access-Control-Request-Private-Network": "true"
    }
  });
  const data: any = await response.json();
  return data as SubjectsTree;
}

export const getRuns = async (): Promise<QueueJob[]> => {
  const getRunsPath = API_URL + '/runs';
  const response = await fetch(getRunsPath, {
    headers: {
      "Access-Control-Request-Private-Network": "true"
    }
  });
  const data: any = await response.json();
  return data as QueueJob[];
}

export const runQsmPipeline = async (params: any): Promise<void> => {
  const runQsmPath = API_URL + '/qsm/run';
  await axios.post(runQsmPath, params);
}

export const getQsmResults = async () => {
  const getQsmResultsUrl = API_URL + '/qsm/results';
  const response = await fetch(getQsmResultsUrl, {
    headers: {
      "Access-Control-Request-Private-Network": "true"
    }
  });
  const data: any = await response.json();
  return data as any;
}