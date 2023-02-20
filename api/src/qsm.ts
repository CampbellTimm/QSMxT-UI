import { ChildProcessWithoutNullStreams } from "child_process";
import { createChild, setupListeners } from "./util";
import express, { Express, Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';

export const qsmPipeline = async (child: ChildProcessWithoutNullStreams) => {
  console.log('Running QSM Pipeline');
  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => {
      console.log(data.toString()); 
      if (data.includes('Running 0 tasks, and 0 jobs ready')) {
        resolve(null);
      }
    });
    child.stdin.write("python3 /opt/QSMxT/run_2_qsm.py 01_bids 02_qsm_output\n")
  })
  console.log('Finished QSM Pipeline');
}

const runQsm = async (request: Request, response: Response) => {
  const child = await createChild();
  qsmPipeline(child)
  child.kill();
}

export const setupQsmEndpoints = (app: Express) => {
  app.post('/subjects', runQsm)
}