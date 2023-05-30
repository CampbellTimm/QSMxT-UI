import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import logger from "../util/logger";
import { QSMXT_DATE, QSMXT_VERSION } from "../constants";
import convertDicoms from "./convertDicoms";
import sortDicoms from "./sortDicoms";
import runQsmPipeline from "./runQsmPipeline";
import runSegmentation from "./runSegmentation";
import fs from "fs";
import copyBids from "./copyBids";

let qsmxtInstance: ChildProcessWithoutNullStreams;

export const setupListeners = (child: ChildProcessWithoutNullStreams, reject: (reason?: any) => void) => { 
  child.stdout.removeAllListeners();
  child.stderr.removeAllListeners();
  child.removeAllListeners();
  child.stderr.on('data', (data) => {
    logger.red(`stderr: ${data}`);
    reject(data)
  });
  child.on('error', (error) => {
    logger.red(`error: ${error.message}`);
    reject(error.message)
  });
}

export const createQsmxtInstance = async () => {
  logger.green('Creating QSMxT instance')
  const qsmxt: any = spawn('/neurocommand/local/fetch_and_run.sh', ['qsmxt', QSMXT_VERSION, QSMXT_DATE ]);

  await new Promise((resolve, reject) => {
    setupListeners(qsmxt, () => {});
    // setupListeners(qsmxt, reject);
    qsmxt.stdout.on('data', (data: any) => {
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

// TODO - add timeout paramater ??
export const runQsmxtCommand = async (command: string, completionString: string, logFilePath: string | null = null, errorString: string = 'ERROR:') => {
  const qsmxt = await getQsmxtInstance();
  await new Promise((resolve, reject) => {
    setupListeners(qsmxt, reject);
    qsmxt.stdout.on('data', (data) => { 
      const stringData = data.toString();
      stringData.split('\n').forEach((line: string) => {
        if (line.includes('ERROR:')) {
          logger.red(line);
        } else if (logFilePath) {
          fs.appendFileSync(logFilePath, line + '\n', { encoding: 'utf-8' })
          // logger.blue(line)
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

export const killChildProcess = () => {
  if (qsmxtInstance) {
    logger.green('Killing child');
    qsmxtInstance.kill();
  }
}

export default {
  convertDicoms,
  sortDicoms,
  runQsmPipeline,
  runSegmentation,
  copyBids
}