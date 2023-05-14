import { Request, Response } from "express";
import { DicomConvertParameters, DicomSortParameters, JobType, } from "../types";
import { unknownErrorHandler } from ".";
import { addJobToQueue } from "../core/jobHandler";
import logger from "../core/logger";
import database from "../database";

const uploadSubjectDicomData = async (request: Request, response: Response) => {
  logger.green("Received request to copy dicoms at " + new Date().toISOString());
  const body = request.body;
  const { copyPath, usePatientNames, useSessionDates, checkAllFiles, t2starwProtocolPatterns, t1wProtocolPatterns } = body; 

  const fixedCopyPath = copyPath.includes(":\\")
    ? `/neurodesktop-storage${copyPath.split('neurodesktop-storage')[1].replace(/\\/g, "/")}`
    : copyPath;

  const dicomSortParameters: DicomSortParameters = {
    copyPath: fixedCopyPath,
    usePatientNames: usePatientNames === 'true',
    useSessionDates: useSessionDates  === 'true',
    checkAllFiles: checkAllFiles  === 'true'
  }
  await addJobToQueue(JobType.DICOM_SORT, dicomSortParameters);

  const dicomConvertParameters: DicomConvertParameters = {
    t2starwProtocolPatterns: JSON.parse(t2starwProtocolPatterns),
    t1wProtocolPatterns: JSON.parse(t1wProtocolPatterns),
    usePatientNames: usePatientNames === 'true',
    useSessionDates: useSessionDates  === 'true',
    checkAllFiles: checkAllFiles  === 'true'
  }
  await addJobToQueue(JobType.DICOM_CONVERT, dicomConvertParameters);
  
  response.statusMessage = "Successfully copied DICOMs. Starting sort and conversion jobs."
  response.status(200).send();
}


const getSubjectsTree = async (request: Request, response: Response) => {
  const subjects = await database.subjects.get.all();
  return response.status(200).send(subjects)
}

export default {
  upload: {
    dicom: uploadSubjectDicomData
  },
  get: getSubjectsTree
}
