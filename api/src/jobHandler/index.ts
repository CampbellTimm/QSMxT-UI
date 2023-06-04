import { v4 as uuidv4 } from 'uuid';
import { BIDsCopyParameters, DicomConvertParameters, DicomSortParameters, Job, JobParameters, JobStatus, JobType, QsmParameters, SegementationParameters } from "../types";
import { BIDS_FOLDER, DICOMS_FOLDER, LOGS_FOLDER, QSM_FOLDER } from "../constants";
import http from "http";
import qsmxt from "../qsmxtInstanceHandler";
import path from "path";
import fs from "fs";
import sockets from "./sockets";
import logger from '../util/logger';
import database from '../databaseClient';

let jobQueue: Job[] | null;

const getJobQueue = async () => {
  if (!jobQueue) {
    jobQueue = await database.jobs.get.incomplete();
  }
  return jobQueue;
}

const getJobResultsFolder = (jobType: JobType, id: string, linkedQsmJob: string | undefined) => {
  if (jobType === JobType.DICOM_SORT) {
    return DICOMS_FOLDER;
  }
  if (jobType === JobType.DICOM_CONVERT) {
    return BIDS_FOLDER;
  }
  if (jobType === JobType.QSM) {
    return path.join(QSM_FOLDER, id);
  }
  if (jobType === JobType.BIDS_COPY) {
    return BIDS_FOLDER;
  }
  if (jobType === JobType.SEGMENTATION) {
    return path.join(QSM_FOLDER, linkedQsmJob as string);
  }
  return '';
}

const getLogFile = async (jobType: JobType, id: string, linkedQsmJob: string | undefined): Promise<string> => {
  const rootFolder: string = getJobResultsFolder(jobType, id, linkedQsmJob);
  let logFile = null;
  while (!logFile) {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (fs.existsSync(rootFolder)) {
      const dicomFiles = fs.readdirSync(rootFolder);
      const potentialLogFile = dicomFiles.find(fileName => fileName.includes('log') && fileName !== 'pypeline.log' && fileName !== 'qsmxt_log.log' );
      if (potentialLogFile) {
        logFile = potentialLogFile;
      }
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
}

const saveNewJob = async (job: Job) => {
  await database.jobs.save(job);
  jobQueue = await database.jobs.get.incomplete();
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
  sockets.sendJobAsNotification(job);
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
  await updateJob(job);
}

const runJob = async (jobId: string) => {
  const { id, type, parameters, linkedQsmJob } = await getJobById(jobId);
  let logFilePath: string = '';
  try {
    setJobToInProgress(jobId);
    let jobPromise;
    if (type === JobType.DICOM_SORT) {
      jobPromise = qsmxt.sortDicoms(parameters as DicomSortParameters);
    } else if (type === JobType.DICOM_CONVERT) {
      jobPromise = qsmxt.convertDicoms(parameters as DicomConvertParameters);
    } else if (type === JobType.QSM) {
      const { subjects, sessions, runs, pipelineConfig } = parameters as QsmParameters;
      try {
        fs.mkdirSync(path.join(QSM_FOLDER, id));
      } catch (err) {}
      jobPromise = qsmxt.runQsmPipeline(id, subjects, sessions, runs, pipelineConfig);
    } else if (type === JobType.SEGMENTATION) {
      const { subjects, linkedQsmJob, sessions } = parameters as SegementationParameters;
      jobPromise = qsmxt.runSegmentation( subjects, linkedQsmJob, sessions);
    } else if (type === JobType.BIDS_COPY) {
      const { copyPath, uploadingMultipleBIDs } = parameters as BIDsCopyParameters;
      jobPromise = qsmxt.copyBids(copyPath, uploadingMultipleBIDs);
    }
    logFilePath = await getLogFile(type, id, linkedQsmJob);
    sockets.createInProgressSocket(logFilePath);
    await jobPromise;
    await setJobToComplete(id, JobStatus.COMPLETE);
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
  if (logFilePath) {
    const logContents = fs.readFileSync(logFilePath, { encoding: 'utf-8' });
    fs.writeFileSync(path.join(LOGS_FOLDER, `${id}.log`), logContents, { encoding: 'utf-8' });
  }

}

const addJobToQueue = async (type: JobType, parameters: JobParameters, linkedQsmJob: string | null = null, description: string | null = null): Promise<string> => {
  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const job: Job = {
    id,
    type,
    status: JobStatus.NOT_STARTED,
    createdAt,
    startedAt: null,
    finishedAt: null,
    parameters,
  }
  if (linkedQsmJob) {
    job.linkedQsmJob = linkedQsmJob;
  }
  if (description) {
    job.description = description;
  }
  await saveNewJob(job);
  sockets.sendJobAsNotification(job);
  if ((jobQueue as Job[]).length === 1) {
    runJob((jobQueue as Job[])[0].id);
  }
  return id;
}

const setup = async (server: http.Server) => {
  await sockets.setup(server);
}

const jobHandler = {
  addJobToQueue,
  setup
}

export default jobHandler;

