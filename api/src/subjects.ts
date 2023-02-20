import {Express, Request, Response} from "express";
import fs from "fs";
import path from "path";

const bidsFolder = path.join(__dirname, `../public/qsmxt/bids`);

type Session = {
  runs: {
    magnitude: any,
    phase: any,
  }[]
}

type SubjectsTree = {
  [subject: string]: { sessions: {[sessionName: string]: Session} }
}

const getSubjectsTree = async (request: Request, response: Response) => {
  const subjectNames: string[] = fs.readdirSync(bidsFolder);
  const subjectTree: SubjectsTree = {};
  subjectNames.forEach((subject: string) => {
    const sessions: {[sessionName: string]: Session} = {};
    fs
      .readdirSync(path.join(bidsFolder, `./${subject}`))
      .forEach((sessionName: string) => {
        const sessionFiles = fs.readdirSync(path.join(bidsFolder, `./${subject}/${sessionName}/anat`));
        const runs: Set<string> = new Set();
        sessionFiles.forEach((fileName: string) => {
          const runNumber = fileName.split("_ses-")[1].split("_")[0];
          runs.add(runNumber);
        })
        sessions[sessionName] = {
          runs: Array.from(runs).map((runNumber: string) => {
            const magnitudeMetadataFilePath = path.join(
              bidsFolder, 
              `./${subject}/${sessionName}/anat/${subject}_${sessionName}_run-${runNumber}_part-magnitude_T2starw.json`
            );
            const phaseMetadataFilePath = path.join(
              bidsFolder, 
              `./${subject}/${sessionName}/anat/${subject}_${sessionName}_run-${runNumber}_part-phase_T2starw.json`
            );
            return {
              magnitude: JSON.parse(fs.readFileSync(magnitudeMetadataFilePath, { encoding: 'utf-8' })),
              phase: JSON.parse(fs.readFileSync(phaseMetadataFilePath, { encoding: 'utf-8' })),
            }
          })
        }
      })
    subjectTree[subject] = { 
      sessions: sessions
    }
  })
  return response.status(200).send(subjectTree);
}

// const uploadSubjectsData = async (request: Request, response: Response) => {

// }

export const setupSubjectsEndpoints = (app: Express) => {
  // app.get('/bids', getBids)
  app.get('/subjects', getSubjectsTree)
  // app.get('/subjects/upload', uploadSubjectsData)
}