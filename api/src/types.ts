export type SubjectEchos = {
  [echoNumber: string]: {
    magnitude: any,
    phase: any,
  }
}

// export type SubjectRun = {
//   echos: SubjectEchos
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
  [subject: string]: { 
    sessions: SubjectSessions 
  }
}

export type Subject = {
  subject: string, 
  uploadFormat: SubjectUploadFormat, 
  parameters: DicomConvertParameters, 
  dataTree: SubjectSession
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
  QSM = 'QSM Pipeline'
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
  usePatientNames: boolean,
  useSessionDates: boolean,
  checkAllFiles: boolean
}

export type QsmParameters = {
  subject: string,
  premade: string
}

export type JobParameters = DicomSortParameters | DicomConvertParameters | QsmParameters

export type Job = {
  id: string,
  subject?: string,
  cohort?: string,
  type: JobType,
  status: JobStatus,
  createdAt: string,
  startedAt: string | null,
  finishedAt: string | null,
  parameters: JobParameters,
  error?: string
}

export type Cohorts = {[cohort: string]: {
  description: string,
  subjects: string[]
}}

export enum SubjectUploadFormat {
  DICOM = 'DICOM'
}