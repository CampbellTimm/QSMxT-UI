// export type SubjectEchos = {
//   [echoNumber: string]: {
//     magnitude: any,
//     phase: any,
//   }
// }

export type SubjectRun = {
  echos: string[]
}

export type SubjectRuns = {
  [runNumber: string]: SubjectRun
}

export type SubjectSession = {
  runs: SubjectRuns
}

export type SubjectSessions =  {
  [sessionNumber: string]: SubjectSession
}

export type SubjectsTree = {
  // [subject: string]: { 
    sessions: SubjectSessions 
  // }
}

export type Subject = {
  subject: string, 
  uploadFormat: SubjectUploadFormat, 
  parameters: DicomConvertParameters, 
  dataTree: SubjectsTree
}


export enum SubjectUploadFormat {
  DICOM = 'DICOM'
}

export enum JobStatus {
  NOT_STARTED = 'NotStarted',
  IN_PROGRESS = 'InProgress',
  COMPLETE = 'Complete',
  FAILED = 'Failed'
}

export enum JobType {
  DICOM_SORT = 'Dicom Sort',
  DICOM_CONVERT = 'Dicom Convert',
}

export type DicomSortParameters = {
  copyPath: string,
  usePatientNames: boolean,
  useSessionDates: boolean,
  checkAllFiles: boolean
}

export type DicomConvertParameters = {
  t2starwProtocolPatterns: string[],
  t1wProtocolPatterns: string[],
}

export type JobParameters = DicomSortParameters | DicomConvertParameters

export type Job = {
  id: string,
  type: JobType,
  status: JobStatus,
  createdAt: string,
  startedAt: string | null,
  finishedAt: string | null,
  parameters: JobParameters
}

export type Cohorts = {[cohort: string]: {
  description: string,
  subjects: string[]
}}