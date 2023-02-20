export type Cohorts = {
  [cohortName: string]: string[]
};

export type Session = {
  runs: {
    magnitude: any,
    phase: any,
  }[]
}

export type Subjects = {
  [subject: string]: { 
    sessions: {[sessionName: string]: Session} 
  }
}