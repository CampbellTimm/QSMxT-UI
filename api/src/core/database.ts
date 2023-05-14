import fs from "fs";
import { COHORTS_FILE_PATH, JOBS_FILE_PATH } from "../core/constants";
import { Job, JobStatus } from "./types";

const getAllCohorts = () => {
  return JSON.parse(fs.readFileSync(COHORTS_FILE_PATH, { encoding: 'utf-8' }));
}

const saveCohorts = (cohorts: any) => {
  fs.writeFileSync(COHORTS_FILE_PATH, JSON.stringify(cohorts, null, 2));
}

const deleteCohort = (cohortName: string) => {
  const cohorts = getAllCohorts();
  delete cohorts[cohortName];
  saveCohorts(cohorts);
}

const createCohort = (cohortName: string) => {
  const cohorts = getAllCohorts();
  const updatedCohorts = Object.assign({}, cohorts, {[cohortName]: []});
  saveCohorts(updatedCohorts);
}

const saveJobs = (jobQueue: Job[]) => {
  fs.writeFileSync(JOBS_FILE_PATH, JSON.stringify(jobQueue, null, 2));
}

const getJobs = (): Job[] => {
  return JSON.parse(fs.readFileSync(JOBS_FILE_PATH, { encoding: 'utf-8' }));
}

const addJob = (job: Job) => {
  const jobQueue = getJobs();
  jobQueue.push(job);
  saveJobs(jobQueue);
}

const updateJob = (updatedJob: Job) => {
  const jobs = getJobs().map(job => {
    if (job.id === updatedJob.id) {
      return updatedJob
    } else {
      return job
    }
  });
  saveJobs(jobs);
}

const deleteJob = (jobId: string) => {
  const jobs = getJobs();
  const updatedJobs = jobs.filter(job => {
    if (job.id === jobId) {
      return false;
    }
    return true;
  })
  saveJobs(updatedJobs);
}

const getJob = (jobId: string): Job => {
  const jobs = getJobs();
  return jobs.find(job => job.id === jobId) as Job;
}

const getIncompleteJobs = () => {
  const jobs = getJobs().filter(job => {  
    if (job.status === JobStatus.COMPLETE || job.status === JobStatus.FAILED) {
      return false;
    }
    return true;
  });
  return jobs;
}

const deleteIncompleteJobs = () => {
  const jobs = getJobs().filter(job => {  
    if (job.status === JobStatus.COMPLETE || job.status === JobStatus.FAILED) {
      return true;
    }
    return false;
  });
  saveJobs(jobs);
}


export default {
  createCohort,
  saveCohorts,
  getAllCohorts,
  deleteCohort,

  getJobs,
  addJob,
  updateJob,
  saveJobs,
  getJob,
  getIncompleteJobs,

  deleteIncompleteJobs
}