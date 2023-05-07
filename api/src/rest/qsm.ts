import { Express, Request, Response } from "express";
import fs from "fs-extra";
import { addToQueue } from "../service/queue";
import qsmxt from "../service/qsmxt";
import { logGreen, logYellow } from "../util/logger";
import { COHORTS_TREE_PATH, QSM_FOLDER } from "../core/constants";
import path from "path";

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


const copyDicoms = async (request: Request, response: Response) => {
  logGreen("Received request to copy dicoms at " + new Date().toISOString());
  const copyPath = request.body.path;
  addToQueue("Dicom Sort", async () => qsmxt.sortDicoms(copyPath));
  addToQueue("Dicom Convert", async () => qsmxt.convertDicoms())
  response.status(200).send();
}

const runQsm = async (request: Request, response: Response) => {
  logGreen("Received request to run QSM at " + new Date().toISOString());
  const { cohorts, subjects, premade } = request.body;
  const cohortsTree = JSON.parse(fs.readFileSync(COHORTS_TREE_PATH, { encoding: 'utf-8'}));

  const subjectsToRun = [...(subjects || [])];
  (cohorts || []).forEach((cohort: any) => {
    subjectsToRun.push(...cohortsTree[cohort])
  });

  subjectsToRun.forEach(subject => {
    addToQueue("QSM Pipeline", async () => qsmxt.runQsm(subject, premade));
  })

  response.status(200).send();
}

const runSegmentation = () => {

}

const getQSM = async (request: Request, response: Response) => {
  const qsmResultSubjects: string[] = fs.readdirSync(QSM_FOLDER);

  const resultTree: any = {};

  qsmResultSubjects.forEach(subject => {

    resultTree[subject] = {};
    const subjectResultFolder = path.join(QSM_FOLDER, subject);

    const subjectRuns = fs.readdirSync(subjectResultFolder);
    subjectRuns.forEach(runId => {
      resultTree[subject][runId] = [];
      const resultsFilesPath = path.join(subjectResultFolder, runId, "qsm_final/_qsmjl_rts0"); // FINE FOLDER DYNAMICALLY
      const nifitis = fs.readdirSync(resultsFilesPath).filter(fileName => fileName.includes(".nii"));


      resultTree[subject][runId] = nifitis;
    })


  })

  response.status(200).send(resultTree);

  // logYellow(qsmResultSubjects);
}

export const setupQsmEndpoints = (app: Express) => {
  app.post('/dicoms/copy', copyDicoms);
  app.post('/qsm/run', runQsm);
  app.get('/qsm/results', getQSM);
  // app.post('/dicoms/upload', uploadDicoms)

}