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

export type QueueJob = {
  id: string,
  startTime: string,
  description: string,
  execute: any
}