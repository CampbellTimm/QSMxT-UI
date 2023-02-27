import { ChildProcessWithoutNullStreams } from "child_process";
import { addToQueue } from "./queue";
import { createChild, getChildProcess, setupListeners } from "../util";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import fs from "fs-extra";

const sortDicoms = async (inputPath: string, outputPath: string) => {
  const child = await getChildProcess();

  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => { 
      console.log(`CHILD STD OUT: ${data}`);
      if (data.includes('INFO: Finished')) {
        resolve(null);
      }
    });

    console.log("Starting dicom sort");
 
    const command = `run_0_dicomSort.py ${inputPath} ${outputPath}`;
    console.log(command);
    child.stdin.write(command + "\n");
  })
  console.log('Sorted Dicoms');

  console.log('Adding dicom convert to queue')
  addToQueue(
    "Dicom Convert",
    async () => convertDicoms()
  )

}

export const convertDicoms = async () => {
  const child = await getChildProcess();

  console.log('Converting Dicoms');

  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => {
      console.log(`CHILD STD OUT: ${data}`);
      if (data.includes('INFO: Finished')) {
        resolve(null);
      }
    });
    const dicomPath = path.join(process.cwd(), "./public/qsmxt/dicoms");
    const bidsPath = path.join(process.cwd(), "./public/qsmxt/bids");

    const command = `run_1_dicomConvert.py ${dicomPath} ${bidsPath}`;

    console.log(command);
    child.stdin.write(command + "\n")
  })

  console.log('Converted Dicoms')
}

export const runQsm = async (allSubjects: string[]) => {

  const id = uuidv4();

  allSubjects.forEach(subject => {
    const srcDir = path.join(process.cwd(), `./public/qsmxt/bids/${subject}`);
    const destDir = path.join(process.cwd(), `./public/qsmxt/qsmTemp/${id}/${subject}`)

    fs.copySync(srcDir, destDir, { overwrite: true })
  });

  const child = await getChildProcess();

  console.log('Converting Dicoms');

  await new Promise((resolve, reject) => {
    setupListeners(child, reject);
    child.stdout.on('data', (data) => {
      console.log(`CHILD STD OUT: ${data}`);
      if (data.includes('INFO: Finished')) {
        resolve(null);
      }
      if (data.includes("Enter a number to customize; enter 'run' to run:")) {
        child.stdin.write("run" + "\n")
      }
    });
    const bidsFolder = path.join(process.cwd(), `./public/qsmxt/qsmTemp/${id}`)
    const qsmFolder = path.join(process.cwd(), `./public/qsmxt/qsm/${id}`)

    fs.mkdirSync(qsmFolder);

    const command = `run_2_qsm.py ${bidsFolder} ${qsmFolder} --premade=fast`;

    console.log(command);
    child.stdin.write(command + "\n")
  })


}

export default {
  sortDicoms,
  runQsm
}