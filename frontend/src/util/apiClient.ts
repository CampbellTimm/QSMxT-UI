import axios from "axios";
import { Cohorts, Job, SubjectsTree } from "../types";
import { message } from "antd";
import { API_URL } from "../core/constants";

const getCohorts = async (): Promise<Cohorts> => {
  const getCohortPath = API_URL + '/cohorts';
  const response = await axios.get(getCohortPath);
  return response.data as Cohorts;
}

const updateCohort = async (cohort: string, subjects: string[]): Promise<boolean> => {
  const updateCohortsPath = API_URL + `/cohorts/${cohort}`;
  let updated = false;
  try {
    const response = await axios.patch(updateCohortsPath, {
      subjects
    });
    message.success(response.statusText);
    updated = true;
  } catch (err) {
    message.error((err as any).message)
  }
  return updated;
}

const createCohort = async (cohort: string, cohortDescription: string): Promise<boolean> => {
  let created = false;
  const getCohortPath = API_URL + `/cohorts/${cohort}`;
  try {
    const response = await axios.post(getCohortPath, {
      cohortDescription
    });
    message.success(response.statusText);
    created = true;
  } catch (err) {
    message.error((err as any).message);
    created = false;
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
    message.error((err as any).message)
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

// TODO - add subject deletion
const deleteSubject = async (subject: string): Promise<null> => {
  return null;
}

export const getJobsQueue = async (): Promise<Job[]> => {
  const getRunsPath = API_URL + '/jobs/queue';
  const response = await fetch(getRunsPath, {
    headers: {
      "Access-Control-Request-Private-Network": "true"
    }
  });
  const data: any = await response.json();
  return data as Job[];
}

export const runQsmPipeline = async (params: any): Promise<void> => {
  const runQsmPath = API_URL + '/qsm/run';
  await axios.post(runQsmPath, params);
}

export const getQsmResults = async () => {
  const getQsmResultsUrl = API_URL + '/jobs/qsm';
  const response = await fetch(getQsmResultsUrl, {
    headers: {
      "Access-Control-Request-Private-Network": "true"
    }
  });
  const data: any = await response.json();
  return data as any;
}

export const getStatus = async () => {
  const getQsmResultsUrl = API_URL + '/status';
  const response = await axios.get(getQsmResultsUrl);
  return response.data as any;
}

export const copyDicoms = async (copyPath: string, usePatientNames: boolean, useSessionDates: boolean, 
    checkAllFiles: boolean, t2starwProtocolPatterns: string[], t1wProtocolPatterns: string[]) => {
  const uploadDicomsUrl = API_URL + '/subjects/dicom';

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
    message.error((err as any).message);
  }
}

const apiClient = {
  getStatus,
  
  createCohort,
  updateCohort,
  getCohorts,
  deleteSubject,

  copyDicoms,
  deleteCohort,

  getSubjects,

  getJobsQueue
}


export default apiClient;