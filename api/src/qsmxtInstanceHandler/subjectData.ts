import path from "path";
import fs from "fs";
import { BIDS_FOLDER, DICOMS_FOLDER } from "../constants";
import { SubjectRuns, SubjectSessions } from "../types";

const getRunNumbersForSession = (sessionFiles: string[]): string[] => {
  const runNumbers: Set<string> = new Set();
  sessionFiles.forEach((fileName: string) => {
    const runNumber = (/(?<=run-)\d*(?=_echo)/g.exec(fileName) || [])[0];
    if (runNumber) {
      runNumbers.add(runNumber as string);
    }
  })
  return Array.from(runNumbers);
}

const getEchoNumbersForRun = (sessionFiles: string[], runNumber: string): string[] => {
  const echoNumbers: Set<string> = new Set();
  const echoNumberRegex = `(?<=run-${runNumber}_echo-)\\d*(?=_part)`;
  sessionFiles
    .filter(file => file.includes(`run-${runNumber}_echo-`))
    .forEach((fileName: string) => {
      const echoNumber = (new RegExp(echoNumberRegex, "g").exec(fileName) || [])[0]
      echoNumbers.add(echoNumber as string);
    });
  return Array.from(echoNumbers);
}

// const getMagnitudeAndPhaseForEcho = (runsPath: string, subject: string, sessionNumber: string, runNumber: string, echoNumber: string) => {
//   const magnitudeMetadataFilePath = path.join(runsPath,`./${subject}_${sessionNumber}_run-${runNumber}_echo-${echoNumber}_part-mag_MEGRE.json`);
//   const phaseMetadataFilePath = path.join(runsPath, `./${subject}_${sessionNumber}_run-${runNumber}_echo-${echoNumber}_part-phase_MEGRE.json`
//   );
//   const magnitude = fs.existsSync(magnitudeMetadataFilePath) && JSON.parse(fs.readFileSync(magnitudeMetadataFilePath, { encoding: 'utf-8' }))
//   const phase = fs.existsSync(phaseMetadataFilePath) && JSON.parse(fs.readFileSync(phaseMetadataFilePath, { encoding: 'utf-8' }))
//   return { 
//     magnitude, 
//     phase 
//   }
// }

const getEchosForRun = (sessionFiles: string[], runsPath: string, subject: string, sessionNumber: string, runNumber: string) => {
  const echoNumbers = getEchoNumbersForRun(sessionFiles, runNumber);
  return echoNumbers;
  // const echos: SubjectEchos = {};
  // echoNumbers.forEach(echoNumber => {
  //   const { magnitude, phase } = getMagnitudeAndPhaseForEcho(runsPath, subject, sessionNumber, runNumber, echoNumber);
  //   if (magnitude && phase ) {
  //     echos[echoNumber] = {
  //       magnitude,
  //       phase
  //     }
  //   }
  // })
  // return echos;
}

const getRunsForSession = (subjectPath: string, subject: string, sessionNumber: string): SubjectRuns => {
  const runs: SubjectRuns = {};
  const runsPath = path.join(subjectPath, `./${sessionNumber}/anat`);
  const sessionFiles = fs.readdirSync(runsPath);
  const runNumbers = getRunNumbersForSession(sessionFiles);
  runNumbers.forEach((runNumber: string) => {
    const echos = getEchosForRun(sessionFiles, runsPath, subject, sessionNumber, runNumber);
    if (Object.keys(echos).length) {
      runs[runNumber] = {
        echos
      }
    }
  })
  return runs;
}

export const getSessionsForSubject = (subject: string): SubjectSessions => {
  const sessionsTree: SubjectSessions = {};
  const subjectPath = path.join(BIDS_FOLDER, `./${subject}`);
  const sessionNumbers = fs.readdirSync(subjectPath);
  sessionNumbers.forEach((sessionNumber: string) => {
      sessionsTree[sessionNumber] = {
        runs: getRunsForSession(subjectPath, subject, sessionNumber)
      }
    });
  return sessionsTree;
}