import { Express, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { DicomSortParameters, Job, JobParameters, JobStatus, JobType } from "../types";
import { unknownErrorHandler } from ".";
import database from "../database";
import { QSM_FOLDER } from "../constants";
import path from "path";
import fs from "fs";

const getJobHistory = async (request: Request, response: Response) => {
  const history = await database.jobs.get.complete();
  response.status(200).send(history);
}

const getJobQueue = async (request: Request, response: Response) => {
  const history = await database.jobs.get.incomplete();
  response.status(200).send(history);
}

// const getQsmJobs = async (request: Request, response: Response) => {
//   const qsmJobs = await database.jobs.get.qsm();

//   const withExtra = qsmJobs.map(job => {
//     const x = path.join(QSM_FOLDER, job.subject as string, job.id, 'qsm_final');
//     const folders = fs.readdirSync(x)
//     const folder = folders[0];
//     const images = fs.readdirSync(path.join(x, folder));
//     return {
//       ...job,
//       images: images.map(image => path.join('qsm', job.subject as string, job.id, 'qsm_final', folder, image))
//     }
//   })


//   response.status(200).send(withExtra);
// }

export default {
  history: {
    get: getJobHistory
  },
  queue: {
    get: getJobQueue
  },
  // qsm: {
  //   get: getQsmJobs
  // }
}