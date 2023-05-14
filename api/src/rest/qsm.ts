import { Express, Request, Response } from "express";
import fs from "fs-extra";
import { addJobToQueue } from "../service/jobHandler";
import qsmxt from "../service/qsmxt";
import logger from "../core/logger";
import { COHORTS_TREE_PATH, QSM_FOLDER } from "../core/constants";
import path from "path";
import { DicomConvertParameters, DicomSortParameters, JobType, QsmParameters } from "../core/types";
import { unknownErrorHandler } from "./util";
import { queueSocket } from "../service/sockets";

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
const copyDicoms = async (request: Request, response: Response) => {
  logger.green("Received request to copy dicoms at " + new Date().toISOString());
  const body = request.body;
  const { copyPath, usePatientNames, useSessionDates, checkAllFiles, t2starwProtocolPatterns, t1wProtocolPatterns } = body; 

  const fixedCopyPath = copyPath.includes(":\\")
    ? `/neurodesktop-storage${copyPath.split('neurodesktop-storage')[1].replace(/\\/g, "/")}`
    : copyPath;

  const dicomSortParameters: DicomSortParameters = {
    copyPath: fixedCopyPath,
    usePatientNames: usePatientNames === 'true',
    useSessionDates: useSessionDates  === 'true',
    checkAllFiles: checkAllFiles  === 'true'
  }
  addJobToQueue(JobType.DICOM_SORT, dicomSortParameters);

  const dicomConvertParameters: DicomConvertParameters = {
    t2starwProtocolPatterns: JSON.parse(t2starwProtocolPatterns),
    t1wProtocolPatterns: JSON.parse(t1wProtocolPatterns)
  }
  addJobToQueue(JobType.DICOM_CONVERT, dicomConvertParameters);
  
  response.statusMessage = "Successfully copied DICOMs. Starting sort and conversion jobs."
  response.status(200).send();
}

const runQsm = async (request: Request, response: Response) => {
  logger.green("Received request to run QSM at " + new Date().toISOString());
  const { cohorts, subjects, premade } = request.body;
  const cohortsTree = JSON.parse(fs.readFileSync(COHORTS_TREE_PATH, { encoding: 'utf-8'}));
  const subjectsToRun = [...(subjects || [])];
  (cohorts || []).forEach((cohort: any) => {
    subjectsToRun.push(...cohortsTree[cohort])
  });
  subjectsToRun.forEach(subject => {
    const qsmParameters: QsmParameters = {
      subject,
      premade
    }
    addJobToQueue(JobType.QSM, qsmParameters);
  })
  response.status(200).send();
}

const runSegmentation = () => {

}

const getQSM = async (request: Request, response: Response) => {
  // console.log(queueSocket);
  // // @ts-ignore
  // queueSocket.emit("any", "test2");

  // response.status(200).send({});
  // return;


  const qsmResultSubjects: string[] = fs.readdirSync(QSM_FOLDER);

  const resultTree: any = {};

  qsmResultSubjects.forEach(subject => {

    resultTree[subject] = {};
    const subjectResultFolder = path.join(QSM_FOLDER, subject);

    const subjectRuns = fs.readdirSync(subjectResultFolder);
    subjectRuns.forEach(runId => {
      resultTree[subject][runId] = [];
      const resultsFilesPath = path.join(subjectResultFolder, runId, "qsm_final/_qsmjl_rts0"); // FIND FOLDER DYNAMICALLY
      const nifitis = fs.readdirSync(resultsFilesPath).filter(fileName => fileName.includes(".nii"));


      resultTree[subject][runId] = nifitis;
    })


  })

  response.status(200).send(resultTree);

  // logYellow(qsmResultSubjects);
}

export const setupQsmEndpoints = (app: Express) => {
  app.post('/dicoms/copy', unknownErrorHandler(copyDicoms));
  app.post('/qsm/run', unknownErrorHandler(runQsm));
  app.get('/qsm/results', unknownErrorHandler(getQSM));
  // app.post('/dicoms/upload', uploadDicoms)
}