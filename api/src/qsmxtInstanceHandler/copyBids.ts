import path from "path";
import database from "../databaseClient";
import fs from "fs";
import { BIDS_FOLDER } from "../constants";
import { SubjectUploadFormat } from "../types";
import { getSessionsForSubject } from "./subjectData";
import { Worker } from 'worker_threads';
import { spawn } from "child_process";
import { setupListeners } from ".";
import logger from "../util/logger";

const logFilePath = path.join(BIDS_FOLDER, 'bidsCopy.log');

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
  fs.writeFileSync(logFilePath, 'Starting BIDs copy.\n', { encoding: 'utf-8' });

  const fixedCopyPath = sourcePath.includes(":\\")
  ? `/neurodesktop-storage${sourcePath.split('neurodesktop-storage')[1].replace(/\\/g, "/")}`
  : sourcePath;

  console.log(sourcePath);
  console.log(fixedCopyPath);

  const subjects: string[] = [];
  if (uploadingMultipleBIDs) {
    fs.appendFileSync(logFilePath, 'Copying multiple BIDs folders.\n');
    subjects.push(...fs.readdirSync(fixedCopyPath));

    await Promise.all(fs.readdirSync(fixedCopyPath).map(async (folder) => {
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
    return database.subjects.save(subject, SubjectUploadFormat.BIDS, {}, { sessions: getSessionsForSubject(subject) });
  }));
  fs.appendFileSync(logFilePath, 'Finished.\n');
  logger.green("Finished copying BIDS");
}



export default copyBids;