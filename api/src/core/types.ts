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