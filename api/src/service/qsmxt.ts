import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import logger from "../core/logger";
import path from "path";
import fs from "fs";
import { BIDS_FOLDER, DICOMS_FOLDER, QSM_FOLDER } from "../core/constants";
import { v4 as uuidv4 } from 'uuid';
import { getQsmxtInstance, setupListeners } from "./childProcess";

const runQsmxtCommand = async (command: string, completionString: string, errorString: string = 'ERROR:') => {
  // TODO - add timeout paramater ??
  const qsmxt = await getQsmxtInstance();
  await new Promise((resolve, reject) => {
    setupListeners(qsmxt, reject);
    qsmxt.stdout.on('data', (data) => { 
      const stringData = data.toString();
      stringData.split('\n').forEach((line: string) => {
        if (line.includes('ERROR:')) {
          logger.red(line);
        } else {
          // logger.magenta(line)
        }
        if (line.includes(completionString)) {
          resolve(null);
        }
        if (line.includes(errorString)) {
          reject(line);
        }
      })
    });
    logger.yellow(`Running: "${command}"`);
    qsmxt.stdin.write(command + "\n");
  });
} 



// TODO - DELETE ORIGINALS PARAMETER???
const sortDicoms = async (copyPath: string, usePatientNames: boolean, useSessionDates: boolean, checkAllFiles: boolean) => {
  logger.green("Starting dicom sort");
  let sortDicomCommand = `run_0_dicomSort.py` 
  if (usePatientNames) {
    sortDicomCommand += ` --use_patient_names`;
  }
  if (useSessionDates) {
    sortDicomCommand += ` --use_session_dates`;
  }
  if (checkAllFiles) {
    sortDicomCommand += ` --check_all_files`;
  }
  sortDicomCommand += ` ${copyPath} ${DICOMS_FOLDER}`;
  const completionString = 'INFO: Finished';
  await runQsmxtCommand(sortDicomCommand, completionString);
  logger.green("Finished sorting dicoms");
}

const convertDicoms = async (t2starwProtocolPatterns: string[], t1wProtocolPatterns: string[]) => {
  logger.green("Starting dicom convert");
  let convertDicomCommand = `run_1_dicomConvert.py ${DICOMS_FOLDER} ${BIDS_FOLDER} --auto_yes`;
  convertDicomCommand += ` --t2starw_protocol_patterns ${t2starwProtocolPatterns.join(',')}`;
  convertDicomCommand += ` --t1w_protocol_patterns ${t1wProtocolPatterns.join(',')}`;
  const completionString = 'INFO: Finished';
  await runQsmxtCommand(convertDicomCommand, completionString);
  logger.green("Finished converting dicoms");
}

const getQsmCmdLineOptions = (subject: string, premade: string = "fast") => {
  return `--premade=${premade} --auto_yes --subject_pattern ${subject}`
}

const runQsm = async (id: string, subject: string, premade: string) => {
  // allSubjects.forEach(subject => {
    logger.green(`Running QSM Pipeline on ${subject}`);
    // FIX
    const subjectFolder = path.join(QSM_FOLDER, subject);
    const resultFolder = path.join(subjectFolder, `/${id}`);
    const qsmxtCmmand = `run_2_qsm.py ${BIDS_FOLDER} ${resultFolder} ${getQsmCmdLineOptions(subject, premade)}`
    const completionString = 'INFO: Finished';
    await runQsmxtCommand(qsmxtCmmand, completionString);
    logger.green(`Finished running QSM Pipeline on ${subject}`);
}

export default {
  sortDicoms,
  convertDicoms,
  runQsm
}