import { Request, Response } from "express";
import fs from "fs-extra";
import { addJobToQueue } from "../jobHandler";
import logger from "../util/logger";
import { QSM_FOLDER } from "../constants";
import path from "path";
import { Cohort, Cohorts, DicomConvertParameters, DicomSortParameters, JobType, QsmParameters, SegementationParameters } from "../types";
import database from "../database";

// TODO - add back later
// const uploadDicoms = async (req: any, res: any) => {
//   console.log('Starting Dicom Upload');
//   if (!req.files) {
//     return res.status(400).send("No files were uploaded.");
//   }
//   console.log(req.files.folderzip.tempFilePath);
//   console.log(JSON.stringify(req.files.folderzip, null, 2));
//   console.log("COPYING")
//   await req.files.folderzip.mv(path.join(process.cwd(), `./temp/zippy.zip`));
//   await decompress(path.join(process.cwd(), `./temp/zippy.zip`), path.join(process.cwd(), `./temp/decompressed`));
//   const rootFolder = fs.readdirSync(path.join(process.cwd(), `./temp/decompressed`))[0];
//   console.log(`rootFolder: ${rootFolder}`);
//   const dicomSortInput = path.join(process.cwd(), `./temp/decompressed/${rootFolder}`);
//   const dicomSortOutput = path.join(process.cwd(), `./public/qsmxt/dicoms`);
//   addToQueue(
//     "Dicom Sort",
//     async () => qsmxtCmdLine.sortDicoms(dicomSortInput)
//   )
//   res.status(200).send();
// }


// TODO - Copy to 'unsorted' before adding to queue
const runQsmPipeline = async (request: Request, response: Response) => {
  logger.green("Received request to run QSM at " + new Date().toISOString());
  console.log(request.body);
  const { sessions, runs, pipelineConfig, subjects, cohorts, createSegmentation, description } = request.body;
  const subjectsFromCohort: Cohort[] = await Promise.all((cohorts || [])
    .map(database.cohorts.get.byName)
  );
  const subjectsToRun = new Set([...(subjects || [])]);
  (subjectsFromCohort).forEach((cohort: Cohort) => {
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
  const linkedQsmJob = "5209b287-7f94-4287-89fa-361a9ab0b9b5";
  // const linkedQsmJob = await addJobToQueue(JobType.QSM, qsmParameters, null, description);
  console.log(createSegmentation);
  if (createSegmentation) {

    const segementationParameters: SegementationParameters = {
      subjects: Array.from(subjectsToRun),
      linkedQsmJob
    }
    addJobToQueue(JobType.SEGMENTATION, segementationParameters, linkedQsmJob);
  }
  response.status(200).send();
}


const getQsmResults = async (request: Request, response: Response) => {
  // console.log(queueSocket);
  // // @ts-ignore
  // queueSocket.emit("any", "test2");

  // response.status(200).send({});
  // return;


  // const qsmResultSubjects: string[] = fs.readdirSync(QSM_FOLDER);
  const results = await database.jobs.get.qsmResults();
  // console.log(results);
  // const resultTree: any = {};

  // qsmResultSubjects.forEach(subject => {

  //   resultTree[subject] = {};
  //   const subjectResultFolder = path.join(QSM_FOLDER, subject);

  //   const subjectRuns = fs.readdirSync(subjectResultFolder);
  //   subjectRuns.forEach(runId => {
  //     resultTree[subject][runId] = [];
  //     const resultsFilesPath = path.join(subjectResultFolder, runId, "qsm_final/_qsmjl_rts0"); // FIND FOLDER DYNAMICALLY
  //     const nifitis = fs.readdirSync(resultsFilesPath).filter(fileName => fileName.includes(".nii"));


  //     resultTree[subject][runId] = nifitis;
  //   })


  // });

  const x = results.map((result: any) => {
    const qsmImageFolder = fs.readdirSync(path.join(QSM_FOLDER, result.id, 'qsm_final'))[0];
    let qsmImages: any = [];

    if (qsmImageFolder) {
      qsmImages = fs.readdirSync(path.join(QSM_FOLDER, result.id, 'qsm_final', qsmImageFolder)).map((fileName: string) => {
        return `http://localhost:5000/qsm/${result.id}/qsm_final/${qsmImageFolder}/${fileName}`
      });
    }

    return {
      ...result,
      analysisResults: JSON.parse(fs.readFileSync(path.join(QSM_FOLDER, result.id, 'results.json'), { encoding: 'utf-8' })),
      qsmImages
    }
  });

  response.status(200).send(x);

  // logYellow(qsmResultSubjects);
}

export default {
  run: runQsmPipeline,
  get: getQsmResults
}