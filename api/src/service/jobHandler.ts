import { v4 as uuidv4 } from 'uuid';
import { DicomConvertParameters, DicomSortParameters, Job, JobParameters, JobStatus, JobType, QsmParameters } from "../core/types";
import { BIDS_FOLDER, DICOMS_FOLDER, QSM_FOLDER } from "../core/constants";
import database from "../core/database";
import qsmxt from "./qsmxt";
import path from "path";
import fs from "fs";
import sockets, { getQueueSocket } from "./sockets";
import logger from '../core/logger';

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

let jobQueue: Job[] | null;

export const getJobQueue = () => {
  if (!jobQueue) {
    jobQueue = database.getIncompleteJobs();
  }
  return jobQueue;
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

const getJobById = (jobId: string): Job => {
  return getJobQueue().find(job => job.id === jobId) as Job;
}

const updateJob = (job: Job) => {
  database.updateJob(job);
  jobQueue = database.getIncompleteJobs();
  // send over socket
  const queueSocket = getQueueSocket();
  if (queueSocket) {
    queueSocket.emit("data", JSON.stringify(jobQueue));
  }
}

// TODO - SAVE LOGS
const setJobToComplete = (jobId: string, status: JobStatus, error: string | null = null) => {
  const job: Job = {
    ...getJobById(jobId),
    status,
    finishedAt: new Date().toISOString()
  }
  if (error) {
    job.error = error
  }
  updateJob(job);
  if (getJobQueue().length) {
    runJob(getJobQueue()[0].id);
  }
}

const setJobToInProgress = (jobId: string) => {
  const job: Job = {
    ...getJobById(jobId),
    status: JobStatus.IN_PROGRESS,
    startedAt: new Date().toISOString()
  }
  updateJob(job)
}

// TODO - save error status
const runJob = async (jobId: string) => {
  const { id, type, parameters } = getJobById(jobId);
  try {
    setJobToInProgress(jobId);
    let jobPromise;
    let resultFolder;
    if (type === JobType.DICOM_SORT) {
      const { copyPath, usePatientNames, useSessionDates, checkAllFiles } = parameters as DicomSortParameters;
      jobPromise = qsmxt.sortDicoms(copyPath, usePatientNames, useSessionDates, checkAllFiles);
      resultFolder = DICOMS_FOLDER;
    } else if (type === JobType.DICOM_CONVERT) {
      const { t2starwProtocolPatterns, t1wProtocolPatterns } = parameters as DicomConvertParameters;
      jobPromise = qsmxt.convertDicoms(t2starwProtocolPatterns, t1wProtocolPatterns);
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
      jobPromise = qsmxt.runQsm(id, subject, premade);
    }
    const subject =  'subject' in parameters 
      ? parameters.subject 
      : '';
    const logFilePath = await getLogFile(type, subject, id);
    console.log(logFilePath);
    sockets.createInProgressSocket(logFilePath);
    await jobPromise;
    setJobToComplete(id, JobStatus.COMPLETE)
  } catch (err) {
    let errorMessage: any;
    if ((err as Error).message) {
      errorMessage = (err as Error).message
      logger.red(err as any)
    } else {
      errorMessage = err;
    }
    logger.red(errorMessage)
    setJobToComplete(id, JobStatus.FAILED, errorMessage)
  }
}

// TODO - FIX, doesnt work if there is jobs in queue on boot
export const addJobToQueue = (type: JobType, parameters: JobParameters): string => {
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
  database.addJob(job);
  jobQueue = database.getIncompleteJobs();
  const queueSocket = getQueueSocket();
  if (queueSocket) {
    queueSocket.emit("data", JSON.stringify(jobQueue));
  }
  if (jobQueue.length === 1) {
    runJob(jobQueue[0].id);
  }
  return id;
}

