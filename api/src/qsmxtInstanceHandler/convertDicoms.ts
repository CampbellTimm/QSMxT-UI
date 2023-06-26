import logger from "../util/logger";
import path from "path";
import fs from "fs";
import { BIDS_FOLDER, DICOMS_FOLDER } from "../constants";
import database from "../databaseClient";
import { DicomConvertParameters, SubjectEchos, SubjectRuns, SubjectSessions, SubjectUploadFormat } from "../types";
import { runQsmxtCommand } from ".";
import { getSessionsForSubject } from "./subjectData";

const convertDicoms = async (parameters: DicomConvertParameters) => {
  const { t2starwProtocolPatterns, t1wProtocolPatterns } = parameters;
  logger.green("Starting dicom convert");
  let convertDicomCommand = `run_1_dicomConvert.py ${DICOMS_FOLDER} ${BIDS_FOLDER} --auto_yes`;
  convertDicomCommand += ` --t2starw_protocol_patterns ${t2starwProtocolPatterns.join(',')}`;
  convertDicomCommand += ` --t1w_protocol_patterns ${t1wProtocolPatterns.join(',')}`;
  const completionString = 'INFO: Finished';
  await runQsmxtCommand(convertDicomCommand, completionString);
  const allSavedSubjectsNames = await database.subjects.get.allNames();
  const subjectFolders = fs.readdirSync(BIDS_FOLDER).filter(fileName => {
    return !fileName.includes('.') && !fileName.includes('README') 
  });
  const newSubjects = subjectFolders.filter(folderName => {
    // @ts-ignore
    return !allSavedSubjectsNames.find(subject => subject === folderName);
  });
  await Promise.all(newSubjects.map(async (subject) => {
    return database.subjects.save(subject, SubjectUploadFormat.DICOM, parameters, { sessions: getSessionsForSubject(subject) });
  }));
  logger.green("Finished converting dicoms");
}

export default convertDicoms;