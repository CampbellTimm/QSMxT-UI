import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import logger from "../core/logger";
import { QSMXT_DATE, QSMXT_VERSION } from "../core/constants";

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
      console.log(data.toString());
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

export const killChildProcess = () => {
  if (qsmxtInstance) {
    console.log('Killing child');
    qsmxtInstance.kill();
  }
}