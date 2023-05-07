import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { logGreen, logYellow, logRed } from "../util/logger";
import path from "path";
import fs from "fs-extra";
import { BIDS_FOLDER, DICOMS_FOLDER } from "../core/constants";
import { v4 as uuidv4 } from 'uuid';

let qsmxtInstance: ChildProcessWithoutNullStreams;

export const setupListeners = (child: ChildProcessWithoutNullStreams, reject: (reason?: any) => void) => { 
  child.stdout.removeAllListeners();
  child.stderr.removeAllListeners();
  child.removeAllListeners();
  child.stderr.on('data', (data) => {
    logRed(`stderr: ${data}`);
    reject(data)
  });
  child.on('error', (error) => {
    logRed(`error: ${error.message}`);
    reject(error.message)
  });
}

export const createQsmxtInstance = async () => {
  logGreen('Creating QSMxT instance')
  const qsmxt = spawn('/neurocommand/local/fetch_and_run.sh', ['qsmxt',  'v2.0.0' , '20230414']);
  await new Promise((resolve, reject) => {
    setupListeners(qsmxt, reject);
    qsmxt.stdout.on('data', (data) => {
      if (data.includes('----------------------------------')) {
        resolve(null);
      }
    });
  })
  return qsmxt;
}

export const getQsmxtInstance = async () => { 
  if (!qsmxtInstance) {
    qsmxtInstance = await createQsmxtInstance();
  }
  return qsmxtInstance
}

const runQsmxtCommand = async (command: string, completionString: string) => {
  // TODO - add timeout paramater ??
  const qsmxt = await getQsmxtInstance();
  await new Promise((resolve, reject) => {
    setupListeners(qsmxt, reject);
    qsmxt.stdout.on('data', (data) => { 
      console.log(data.toString());
      if (data.includes(completionString)) {
        resolve(null);
      }
    }); 
    logYellow(`Running: "${command}"`);
    qsmxt.stdin.write(command + "\n");
  });
} 

const sortDicoms = async (inputPath: string) => {
  logGreen("Starting dicom sort");
  const sortDicomCommand = `run_0_dicomSort.py ${inputPath} ${DICOMS_FOLDER}`;
  const completionString = 'INFO: Finished';
  await runQsmxtCommand(sortDicomCommand, completionString);
  logGreen("Finished sorting dicoms");
}

const convertDicoms = async () => {
  logGreen("Starting dicom convert");
  const convertDicomCommand = `run_1_dicomConvert.py ${DICOMS_FOLDER} ${BIDS_FOLDER}`;
  const completionString = 'INFO: Finished';
  await runQsmxtCommand(convertDicomCommand, completionString);
  logGreen("Finished converting dicoms");
}

const getQsmCmdLineOptions = (subject: string, premade: string = "fast") => {
  return `--premade=${premade} --auto_yes --subject_pattern ${subject}`
}

const runQsm = async (subject: string, premade: string) => {
  // allSubjects.forEach(subject => {
    logGreen(`Running QSM Pipeline on ${subject}`);
    const id= uuidv4();
    // FIX
    const subjectsFolder = path.join(process.cwd(), `./public/qsmxt/qsm/${subject}`);
    try {
      fs.mkdirSync(subjectsFolder);
    } catch (err) {

    }
    const resultFolder = path.join(subjectsFolder, `/${id}`);

    const qsmxtCmmand = `run_2_qsm.py ${BIDS_FOLDER} ${resultFolder} ${getQsmCmdLineOptions(subject, premade)}`
    const completionString = 'INFO: Finished';
    await runQsmxtCommand(qsmxtCmmand, completionString);

    logGreen(`Finished running QSM Pipeline on ${subject}`);
}

export default {
  sortDicoms,
  convertDicoms,
  runQsm
}