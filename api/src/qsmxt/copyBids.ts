import path from "path";
import database from "../database";
import fs from "fs";
import { BIDS_FOLDER } from "../constants";
import { SubjectUploadFormat } from "../types";
import { getSessionsForSubject } from "./subjectData";
import { Worker } from 'worker_threads';
import { spawn } from "child_process";
import { setupListeners } from ".";
import logger from "../util/logger";

const logFilePath = path.join(BIDS_FOLDER, 'bidsCopy.log');

// TODO - talk about in report
// const copyAllFilesAndFolders = (soucePath: string, destinationPath: string) => {
//   const subjectFiles = fs.readdirSync(soucePath, { withFileTypes: true });
//   subjectFiles.forEach(file => {
//     const fileSourcePath = path.join(soucePath, file.name);
//     const fileDestPath = path.join(destinationPath, file.name);
//     const isDirectory = file.isDirectory();
//     if (isDirectory) {
//       fs.mkdirSync(fileDestPath);
//       copyAllFilesAndFolders(fileSourcePath, fileDestPath);
//     } else {
//       fs.copyFileSync(fileSourcePath, fileDestPath)
//     }
//   })
// }

const copyAllFilesAndFolders = async (soucePath: string, destinationPath: string) => {
  const copyInstance: any = spawn('cp', ['-r', soucePath, destinationPath]);
  await new Promise((resolve, reject) => {
    setupListeners(copyInstance, reject);
    copyInstance.on('exit', (code: number) => {
      if (code === 0) {
        resolve(null);
      } else {
        resolve(`Copy failed with code ${code}`);
      }
    })
  })
  copyInstance.kill();
}

const copyBids = async (sourcePath: string, uploadingMultipleBIDs: boolean) => {
  // make log file
  fs.writeFileSync(logFilePath, 'Starting BIDs copy.\n', { encoding: 'utf-8' });

  const fixedCopyPath = sourcePath.includes(":\\")
  ? `/neurodesktop-storage${sourcePath.split('neurodesktop-storage')[1].replace(/\\/g, "/")}`
  : sourcePath;

  // 
  const subjects: string[] = [];
  if (uploadingMultipleBIDs) {
    fs.appendFileSync(logFilePath, 'Copying multiple BIDs folders.\n');
    subjects.push(...fs.readdirSync(fixedCopyPath));

    await Promise.all(fs.readdirSync(fixedCopyPath).map(async (folder) => {
      console.log(folder);
      await copyAllFilesAndFolders(path.join(fixedCopyPath, folder), BIDS_FOLDER);
    }));    
    
  } else {
    fs.appendFileSync(logFilePath, 'Copying single BIDs folder.\n');
    const subjectName = fixedCopyPath.split('/')[fixedCopyPath.split('/').length - 1];
    subjects.push(subjectName);
    await copyAllFilesAndFolders(fixedCopyPath, BIDS_FOLDER);
  }

  fs.appendFileSync(logFilePath, 'Copying saving subjects to database.\n');
  await Promise.all(subjects.map(async (subject) => {
      try {
        return database.subjects.save(subject, SubjectUploadFormat.BIDS, {}, { sessions: getSessionsForSubject(subject) });
      } catch (err) {
        console.log(err);
        throw err;
      }
  }));
  fs.appendFileSync(logFilePath, 'Finished.\n');
  logger.green("Finished copying BIDS");
}



export default copyBids;