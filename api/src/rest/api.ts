import { ChildProcessWithoutNullStreams } from "child_process";
import { createChild, setupListeners } from "../util";
import { Express, Request, Response } from "express";
const { v4 } = require('uuid') ;
import fs from "fs-extra";
import path from "path";
import decompress from "decompress";
import { addToQueue } from "../service/queue";
import qsmxtCmdLine from "../service/qsmxtCmdLine";
import { v4 as uuidv4 } from 'uuid';

const copyDicoms = async (req: Request, res: Response) => {
  console.log(req.body);
  const copyPath = req.body.path;

  console.log(copyPath);

  const dicomSortOutput = path.join(process.cwd(), `./public/qsmxt/dicoms`);

  await addToQueue(
    "Dicom Sort",
    async () => qsmxtCmdLine.sortDicoms(copyPath, dicomSortOutput)
  )

  res.status(200).send();
}


const uploadDicoms = async (req: any, res: any) => {

  console.log('Starting Dicom Upload');

  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  console.log(req.files.folderzip.tempFilePath);
  console.log(JSON.stringify(req.files.folderzip, null, 2));

  console.log("COPYING")
  await req.files.folderzip.mv(path.join(process.cwd(), `./temp/zippy.zip`));



  await decompress(path.join(process.cwd(), `./temp/zippy.zip`), path.join(process.cwd(), `./temp/decompressed`));
  const rootFolder = fs.readdirSync(path.join(process.cwd(), `./temp/decompressed`))[0];

  console.log(`rootFolder: ${rootFolder}`);

  const dicomSortInput = path.join(process.cwd(), `./temp/decompressed/${rootFolder}`);
  const dicomSortOutput = path.join(process.cwd(), `./public/qsmxt/dicoms`);

  addToQueue(
    "Dicom Sort",
    async () => qsmxtCmdLine.sortDicoms(dicomSortInput, dicomSortOutput)
  )

  res.status(200).send();
}

const runQsm = async (request: Request, response: Response) => {
  console.log("Received request to run QSM at " + new Date().toISOString())
  const { cohorts, subjects } = request.body;
  const cohortsTree = JSON.parse(fs.readFileSync(path.join(process.cwd(), './public/qsmxt/cohorts.json'), { encoding: 'utf-8'}));
  const allSubjects = [...(subjects || [])];
  cohorts.forEach((cohort: any) => {
    allSubjects.push(...cohortsTree[cohort])
  });

  console.log(allSubjects);

  
  addToQueue(
    "QSM Pipeline",
    async () => qsmxtCmdLine.runQsm(allSubjects)
  )

  response.status(200).send();

}

export const setupEndpoints = (app: Express) => {
  app.post('/dicoms/upload', uploadDicoms)
  app.post('/dicoms/copy', copyDicoms)
  app.post('/qsm/run', runQsm)
}