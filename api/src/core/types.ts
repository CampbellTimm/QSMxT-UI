export type Echos = {
  [echoNumber: string]: {
    magnitude: any,
    phase: any,
  }
}

export type Run = {
  echos: Echos
}

export type Runs = {
  [runNumber: string]: Run
}

export type Session = {
  runs: Runs
}

export type Sessions =  {
  [sessionNumber: string]: Session
}

export type SubjectsTree = {
  [subject: string]: { 
    sessions: Sessions 
  }
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
}

export type QsmParameters = {
  subject: string,
  premade: string
}

export type JobParameters = DicomSortParameters | DicomConvertParameters | QsmParameters

export type Job = {
  id: string,
  type: JobType,
  status: JobStatus,
  createdAt: string,
  startedAt: string | null,
  finishedAt: string | null,
  parameters: JobParameters,
  error?: string
}
