import axios from "axios";
import { Cohorts, QueueJob, SubjectsTree } from "../core/types";
import { message } from "antd";
import { API_URL } from "../core/constants";

const getCohorts = async (): Promise<Cohorts> => {
  const getCohortPath = API_URL + '/cohorts';
  const response = await axios.get(getCohortPath);
  return response.data as Cohorts;
}

export const postCohorts = async (cohorts: Cohorts): Promise<void> => {
  const getCohortPath = API_URL + '/cohorts';
  await axios.post(getCohortPath, cohorts);
}

const createCohort = async (cohort: string): Promise<boolean> => {
  let created = false;
  const getCohortPath = API_URL + `/cohorts/${cohort}`;
  try {
    const response = await axios.post(getCohortPath);
    message.success(response.statusText);
    created = true;
  } catch (err) {
    message.error(err.message)
  }
  return created;
}

const deleteCohort = async (cohort: string): Promise<boolean> => {
  let deleted = false;
  const getCohortPath = API_URL + `/cohorts/${cohort}`;
  try {
    const response = await axios.delete(getCohortPath);
    message.success(response.statusText);
    deleted = true;
  } catch (err) {
    message.error(err.message)
  }
  return deleted;
}

const getSubjects = async (): Promise<SubjectsTree> => {
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

export const copyDicoms = async (copyPath: string, usePatientNames: boolean, useSessionDates: boolean, 
    checkAllFiles: boolean, t2starwProtocolPatterns: string[], t1wProtocolPatterns: string[]) => {
  const uploadDicomsUrl = API_URL + '/dicoms/copy';

  try {
    const response = await axios({
      method: "post",
      url: uploadDicomsUrl,
      data: {
        copyPath,
        usePatientNames,
        useSessionDates,
        checkAllFiles,
        t2starwProtocolPatterns: JSON.stringify(t2starwProtocolPatterns),
        t1wProtocolPatterns: JSON.stringify(t1wProtocolPatterns)
      },
      headers: { "Content-Type": "multipart/form-data" },
    });
    message.success(response.statusText);
  } catch (err) {
    message.error(err.message);
  }
}

export default {
  copyDicoms,
  createCohort,
  getCohorts,
  deleteCohort,

  getSubjects,

  getRuns
}