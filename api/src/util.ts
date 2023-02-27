import { ChildProcessWithoutNullStreams, spawn } from "child_process";

let childProcess: ChildProcessWithoutNullStreams;

export const getChildProcess = async () => { 
  if (!childProcess) {
    childProcess = await createChild();
  }
  return childProcess
}

export const setupListeners = (child: ChildProcessWithoutNullStreams, reject: (reason?: any) => void) => { 
  child.stdout.removeAllListeners();
  child.stderr.removeAllListeners();
  child.removeAllListeners();
  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    // reject(data)
  });
  child.on('error', (error) => {
    console.error(`error: ${error.message}`);
    // reject(error.message)
  });
  
  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

export const createChild = async () => {
  console.log('Booting')
  const child = spawn('/neurocommand/local/fetch_and_run.sh', ['qsmxt',  '1.3.3' , '20230216']);

  console.log("Booted")

  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => {
      if (data.includes('----------------------------------')) {
        resolve(null);
      }
    });
  })

  console.log('booted');
  
  return child;
}