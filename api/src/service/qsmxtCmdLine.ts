import { ChildProcessWithoutNullStreams } from "child_process";
import { addToQueue } from "./queue";
import { createChild, getChildProcess, setupListeners } from "../util";


const sortDicoms = async (inputPath: string, outputPath: string) => {
  // const queueId = addToQueue("Dicom Sort");
  const child = await getChildProcess();

  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => { 
      if (data.includes('done sorting dicoms')) {
        resolve(null);
      }
    });
    // child.stdin.write("cd /neurodesktop-storage/qsmxt-demo\n")
    const command = `python3 /opt/QSMxT/run_0_dicomSort.py ${inputPath} ${outputPath}`
    console.log(command)
    child.stdin.write(command + "\n")
  })
  console.log('Sorted Dicoms')

}

export default {
  sortDicoms
}