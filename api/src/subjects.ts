import {Express, Request, Response} from "express";
import fs from "fs";
import path from "path";

const bidsFolder = path.join(__dirname, `../public/qsmxt/bids`);

type Echos = {
  [echoNumber: string]: {
    magnitude: any,
    phase: any,
  }
}

type Run = {
  echos: Echos
}

type Runs = {
  [runNumber: string]: Run
}

type Session = {
  runs: Runs
}

type Sessions =  {
  [sessionNumber: string]: Session
}

type SubjectsTree = {
  [subject: string]: { 
    sessions: Sessions 
  }
}

const getSubjectsTree = async (request: Request, response: Response) => {
  const subjectNames: string[] = fs.readdirSync(bidsFolder).filter(fileName => !fileName.includes(".") && fileName !== 'README');
  const subjectTree: SubjectsTree = {};
  subjectNames.forEach((subject: string) => {
    const sessions: Sessions = {};
    fs
      .readdirSync(path.join(bidsFolder, `./${subject}`))
      .forEach((sessionName: string) => {
        const files = fs.readdirSync(path.join(bidsFolder, `./${subject}/${sessionName}/anat`));
        const runNumbers: Set<string> = new Set();
        files.forEach((fileName: string) => {
          const runNumber = (/(?<=run-)\d*(?=_echo)/g.exec(fileName) || [])[0]
          runNumbers.add(runNumber as string);
        })
        const runs: Runs = {};
        Array.from(runNumbers).forEach((runNumber: string) => {
          const echoNumbers: Set<string> = new Set();
          const echoNumberRegex = `(?<=run-${runNumber}_echo-)\\d*(?=_part)`;
          files
            .filter(file => file.includes(`run-${runNumber}_echo-`))
            .forEach((fileName: string) => {
              const echoNumber = (new RegExp(echoNumberRegex, "g").exec(fileName) || [])[0]
              echoNumbers.add(echoNumber as string);
            })
          const echos: Echos = {};
          Array.from(echoNumbers).forEach(echoNumber => {
            const magnitudeMetadataFilePath = path.join(
              bidsFolder, 
              `./${subject}/${sessionName}/anat/${subject}_${sessionName}_run-${runNumber}_echo-${echoNumber}_part-mag_MEGRE.json`
            );
            const phaseMetadataFilePath = path.join(
              bidsFolder, 
              `./${subject}/${sessionName}/anat/${subject}_${sessionName}_run-${runNumber}_echo-${echoNumber}_part-phase_MEGRE.json`
            );
            const magnitude = fs.existsSync(magnitudeMetadataFilePath)
              ? JSON.parse(fs.readFileSync(magnitudeMetadataFilePath, { encoding: 'utf-8' }))
              : null
            const phase = fs.existsSync(phaseMetadataFilePath)
              ? JSON.parse(fs.readFileSync(phaseMetadataFilePath, { encoding: 'utf-8' }))
              : null
            echos[echoNumber] = {
              magnitude,
              phase
            }
          })
          runs[runNumber] = {
            echos
          }
        })
        sessions[sessionName] = {
          runs
        }
      })
    subjectTree[subject] = { 
      sessions: sessions
    }
  })
  return response.status(200).send(subjectTree);
}

export const setupSubjectsEndpoints = (app: Express) => {
  app.get('/subjects', getSubjectsTree)
}