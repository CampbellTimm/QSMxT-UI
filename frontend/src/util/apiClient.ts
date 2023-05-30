import axios from "axios";
import { Cohorts, Job, SubjectsTree } from "../types";
import { message } from "antd";
import { API_URL } from "../core/constants";

const axiosInstance = axios.create({
  timeout: 10 * 1000
});

const getCohorts = async (): Promise<Cohorts> => {
  try {
    const getCohortPath = API_URL + '/cohorts';
    const response = await axiosInstance.get(getCohortPath);
    return response.data as Cohorts;
  } catch (err) {
    message.error((err as any).message);
    return {};
  }
}

const updateCohort = async (cohort: string, subjects: string[]): Promise<boolean> => {
  const updateCohortsPath = API_URL + `/cohorts/${cohort}`;
  let updated = false;
  try {
    const response = await axiosInstance.patch(updateCohortsPath, {
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
    const response = await axiosInstance.post(getCohortPath, {
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
    const response = await axiosInstance.delete(getCohortPath);
    message.success(response.statusText);
    deleted = true;
  } catch (err) {
    message.error((err as any).message);
  }
  return deleted;
}

// TODO - fix any
const getSubjects = async (): Promise<any> => {
  const getSubjectsPath = API_URL + '/subjects';
  try {
    const response = await axiosInstance.get(getSubjectsPath, {
      headers: {
        // "Access-Control-Request-Private-Network": "true"
      }
    });
    const data: any = response.data;
    return data as SubjectsTree;
  } catch (err) {
    message.error((err as any).message);
    return [];
  }
}

// TODO - add subject deletion
const deleteSubject = async (subject: string): Promise<null> => {
  return null;
}

export const getJobsQueue = async (): Promise<Job[]> => {
  const getRunsPath = API_URL + '/jobs/queue';
    try {
    const response = await axiosInstance.get(getRunsPath, {
      headers: {
        // "Access-Control-Request-Private-Network": "true"
      }
    });
    return response.data as Job[];
  }  catch (err) {
    message.error((err as any).message);
    return [];
  }
}

export const getHistory = async (): Promise<Job[]> => {
  const getRunsPath = API_URL + '/jobs/history';
  try {
    const response = await axiosInstance.get(getRunsPath, {
      headers: {
        // "Access-Control-Request-Private-Network": "true"
      }
    });
    return response.data as Job[];
  }  catch (err) {
    message.error((err as any).message);
    return [];
  }
}

export const runQsmPipeline = async (sessions: string[], runs: string[], pipelineConfig: string, subjects: string[], cohorts: string[], createSegmentation: boolean, description: string): Promise<void> => {
  const runQsmPath = API_URL + '/qsm/run';
  try {
    await axiosInstance.post(runQsmPath, {
      sessions,
      runs,
      pipelineConfig,
      subjects,
      cohorts,
      createSegmentation,
      description
    });
  } catch (err) {
    message.error((err as any).message);
  }
}

export const getQsmResults = async () => {
  const getQsmResultsUrl = API_URL + '/qsm/results';
  try {
    const response = await axiosInstance.get(getQsmResultsUrl, {
      headers: {
        // "Access-Control-Request-Private-Network": "true"
      }
    });
    return response.data;
  } catch (err) {
    message.error((err as any).message);
  }
}

export const getStatus = async () => {
  const getQsmResultsUrl = API_URL + '/status';
  const response = await axiosInstance.get(getQsmResultsUrl);
  return response.data as any;
}

export const copyBids = async (copyPath: string, uploadingMultipleBIDs: boolean) => {
  const uploadDicomsUrl = API_URL + '/subjects/bids';
  try {
    const response = await axiosInstance.post(uploadDicomsUrl, {
      // data: {
        copyPath,
        uploadingMultipleBIDs
      // }
    });
    message.success(response.statusText);
  } catch (err) {
    message.error((err as any).message);
  }
}

export const copyDicoms = async (copyPath: string, usePatientNames: boolean, useSessionDates: boolean, 
    checkAllFiles: boolean, t2starwProtocolPatterns: string[], t1wProtocolPatterns: string[]) => {
  const uploadDicomsUrl = API_URL + '/subjects/dicom';
  try {
    const response = await axiosInstance.post(uploadDicomsUrl, {
      // method: "post",
      // url: uploadDicomsUrl,
      // data: {
        copyPath,
        usePatientNames,
        useSessionDates,
        checkAllFiles,
        t2starwProtocolPatterns: JSON.stringify(t2starwProtocolPatterns),
        t1wProtocolPatterns: JSON.stringify(t1wProtocolPatterns)
      // },
      // headers: { "Content-Type": "multipart/form-data" },
    });
    message.success(response.statusText);
    return true;
  } catch (err) {
    message.error((err as any).message);
    return false;
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

  getJobsQueue,

  copyBids,
  getHistory
}


export default apiClient;