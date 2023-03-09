import { ChildProcessWithoutNullStreams } from "child_process";
import { Express, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { createChild } from "../util";

type QueueJob = {
  id: string,
  startTime: string,
  description: string,
  execute: any
}

const jobQueue: QueueJob[] = [];

export const runJobs = async () => {
  while (jobQueue.length) {
    const job = jobQueue[0];

    await job.execute();
    jobQueue.shift();

  }
}

export const addToQueue = (description: string, execute: () => void): string => {

  const id = uuidv4();
  const startTime = new Date().toISOString();

  const job = {
    id,
    description,
    startTime,
    execute
  }
  jobQueue.push(job);

  if (jobQueue.length === 1) {
    runJobs();
  }

  return id;
}


const getQueue = async (request: Request, response: Response) => {
  return response.status(200).send(jobQueue);
}

export const setupQueueEndpoints = (app: Express) => {
  app.get('/runs', getQueue)
}
