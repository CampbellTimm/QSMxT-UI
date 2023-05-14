export type Cohorts = {
  [cohortName: string]: string[]
};


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

export type SubjectsTree = {
  [subject: string]: { sessions: {[sessionNumber: string]: Session} }
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
