import { Request, Response } from "express";
import fs from "fs-extra";
import { addJobToQueue } from "../jobHandler";
import logger from "../util/logger";
import { QSM_FOLDER } from "../constants";
import path from "path";
import { Cohort, JobType, QsmParameters, QsmResult, SegementationParameters } from "../types";
import database from "../database";

const runQsmPipeline = async (request: Request, response: Response) => {
  logger.green("Received request to run QSM at " + new Date().toISOString());
  console.log(request.body);
  const { sessions, runs, pipelineConfig, subjects, cohorts, createSegmentation, description } = request.body;
  const subjectsFromCohort: Cohort[] = await Promise.all((cohorts || [])
    .map(database.cohorts.get.byName)
  );
  const subjectsToRun = new Set([...(subjects || [])]);
  subjectsFromCohort.forEach((cohort: Cohort) => {
    cohort.subjects.forEach((subject: string) => {
      subjectsToRun.add(subject);
    });
  })
  const qsmParameters: QsmParameters = {
    subjects: Array.from(subjectsToRun),
    sessions,
    runs,
    pipelineConfig,
    
  }
  const linkedQsmJob = await addJobToQueue(JobType.QSM, qsmParameters, null, description);
  if (createSegmentation) {
    const segementationParameters: SegementationParameters = {
      subjects: Array.from(subjectsToRun),
      linkedQsmJob,
      sessions
    }
    addJobToQueue(JobType.SEGMENTATION, segementationParameters, linkedQsmJob);
  }
  response.status(200).send();
}

const getQsmResults = async (request: Request, response: Response) => {
  const resultsWithAnalysis = await database.jobs.get.qsmResults();
  const qsmResults: QsmResult[] = resultsWithAnalysis.map((result: any) => {
    let qsmImages: string[] = [];
    let analysisResults = null;
    const qsmResultFolder = path.join(QSM_FOLDER, result.id);
    const qsmFinalFolder = path.join(qsmResultFolder, 'qsm_final');
    if (fs.existsSync(qsmResultFolder) && fs.existsSync(qsmFinalFolder)) {
      const qsmImageFolder = fs.readdirSync(qsmFinalFolder)[0];
      if (qsmImageFolder) {
        qsmImages = fs.readdirSync(path.join(qsmFinalFolder, qsmImageFolder)).map((imageFileName: string) => {
          return `http://localhost:5000/qsm/${result.id}/qsm_final/${qsmImageFolder}/${imageFileName}`
        });
      }
      const analysisResultsFilePath = path.join(qsmResultFolder, 'results.json');
      if (fs.existsSync(analysisResultsFilePath)) {
        analysisResults = JSON.parse(fs.readFileSync(analysisResultsFilePath, { encoding: 'utf-8' }));
      }
    }   
    return {
      ...result,
      analysisResults,
      qsmImages
    }
  });
  response.status(200).send(qsmResults);
}

export default {
  run: runQsmPipeline,
  get: getQsmResults
}