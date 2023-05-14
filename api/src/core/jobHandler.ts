import { v4 as uuidv4 } from 'uuid';
import { DicomConvertParameters, DicomSortParameters, Job, JobParameters, JobStatus, JobType, QsmParameters } from "../types";
import { BIDS_FOLDER, DICOMS_FOLDER, QSM_FOLDER } from "../constants";
import qsmxt from "../qsmxt";
import path from "path";
import fs from "fs";
import sockets, { getQueueSocket } from "./sockets";
import logger from './logger';
import database from '../database';

let jobQueue: Job[] | null;

export const getJobQueue = async () => {
  if (!jobQueue) {
    jobQueue = await database.jobs.get.incomplete();
  }
  return jobQueue;
}

const getJobResultsFolder = (jobType: JobType, subject: string, id: string) =>  {
  if (jobType === JobType.DICOM_SORT) {
    return DICOMS_FOLDER;
  }
  if (jobType === JobType.DICOM_CONVERT) {
    return BIDS_FOLDER;
  }
  if (jobType === JobType.QSM) {
    return path.join(QSM_FOLDER, subject, id);
  }
  return '';
}

const getLogFile = async (jobType: JobType, subject: string, id: string): Promise<string> => {
  const rootFolder: string = getJobResultsFolder(jobType, subject, id);
  let logFile = null;
  while (!logFile) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const dicomFiles = fs.readdirSync(rootFolder);
    const potentialLogFile = dicomFiles.find(fileName => fileName.includes('log'));
    if (potentialLogFile) {
      logFile = potentialLogFile;
    }
  }
  return path.join(rootFolder, logFile);
}

const getJobById = async (jobId: string): Promise<Job> => {
  return (await getJobQueue()).find(job => job.id === jobId) as Job;
}

const updateJob = async (job: Job) => {
  await database.jobs.update(job);
  jobQueue = await database.jobs.get.incomplete();
  const queueSocket = getQueueSocket();
  if (queueSocket) {
    queueSocket.emit("data", JSON.stringify(jobQueue));
  }
}

// TODO - SAVE LOGS
const setJobToComplete = async (jobId: string, status: JobStatus, error: string | null = null) => {
  const job: Job = {
    ...(await getJobById(jobId)),
    status,
    finishedAt: new Date().toISOString()
  }
  if (error) {
    job.error = error
  }
  await updateJob(job);
  if ((jobQueue as Job[]).length) {
    runJob((jobQueue as Job[])[0].id);
  }
}

const setJobToInProgress = async (jobId: string) => {
  const job: Job = {
    ...(await getJobById(jobId)),
    status: JobStatus.IN_PROGRESS,
    startedAt: new Date().toISOString()
  }
  await updateJob(job)
}

const runJob = async (jobId: string) => {
  const { id, type, parameters } = await getJobById(jobId);
  try {
    setJobToInProgress(jobId);
    let jobPromise;
    let resultFolder;
    if (type === JobType.DICOM_SORT) {
      // const { copyPath, usePatientNames, useSessionDates, checkAllFiles } = parameters as DicomSortParameters;
      jobPromise = qsmxt.sortDicoms(parameters as DicomSortParameters);
      resultFolder = DICOMS_FOLDER;
    } else if (type === JobType.DICOM_CONVERT) {
      jobPromise = qsmxt.convertDicoms(parameters as DicomConvertParameters);
      resultFolder = BIDS_FOLDER;
    } else if (type === JobType.QSM) {
      const { subject, premade } = parameters as QsmParameters;
      const subjectFolder = path.join(QSM_FOLDER, subject);
      resultFolder = path.join(subjectFolder, id);
      try {
        fs.mkdirSync(subjectFolder);
      } catch (err) {}
      try {
        fs.mkdirSync(resultFolder);
      } catch (err) {}
      jobPromise = qsmxt.runQsmPipeline(id, subject, premade);
    }
    const logFilePath = await getLogFile(type, (parameters as QsmParameters).subject || '', id);
    sockets.createInProgressSocket(logFilePath);
    await jobPromise;
    setJobToComplete(id, JobStatus.COMPLETE)
  } catch (err) {
    let errorMessage: any;
    if ((err as Error).message) {
      errorMessage = (err as Error).message
    } else {
      errorMessage = err;
    }
    logger.red(errorMessage)
    setJobToComplete(id, JobStatus.FAILED, errorMessage)
  }
}

// TODO - FIX, doesnt work if there is jobs in queue on boot
// TODO - add the cohort to job
export const addJobToQueue = async (type: JobType, parameters: JobParameters): Promise<string> => {
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const job: Job = {
    id,
    type,
    status: JobStatus.NOT_STARTED,
    createdAt,
    startedAt: null,
    finishedAt: null,
    parameters
  }
  if ((parameters as QsmParameters).subject) {
    job.subject = (parameters as QsmParameters).subject;
  }
  // if (parameters.cohort) {

  // }
  await database.jobs.save(job);
  jobQueue = await database.jobs.get.incomplete();
  const queueSocket = getQueueSocket();
  if (queueSocket) {
    queueSocket.emit("data", JSON.stringify(jobQueue));
  }
  if (jobQueue.length === 1) {
    runJob(jobQueue[0].id);
  }
  return id;
}

