import axios from "axios";
import { reduceEachTrailingCommentRange } from "typescript";
import { Cohorts, Subjects } from "./types";

const API_URL = 'http://127.0.0.1:4000'

export const getCohorts = async (): Promise<Cohorts> => {
  const getCohortPath = API_URL + '/cohorts';
  const response = await axios.get(getCohortPath);
  const { data } = response;
  return data;
}

export const postCohorts = async (cohorts: Cohorts): Promise<void> => {
  const getCohortPath = API_URL + '/cohorts';
  await axios.post(getCohortPath, cohorts);
}

export const getSubjects = async (): Promise<Subjects> => {
  const getSubjectsPath = API_URL + '/subjects';
  const response = await axios.get(getSubjectsPath);
  const { data } = response;
  return data as Subjects;
}

export const runQsmPipeline = async (params: any): Promise<Subjects> => {
  const runQsmPath = API_URL + '/qsm/run';
  const response = await axios.post(runQsmPath, params);
  const { data } = response;
  return data as Subjects;
}