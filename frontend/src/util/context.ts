import React from 'react';
import { Cohorts, QueueJob, SubjectsTree } from './types';

export interface SiteContext {
  ongoingRuns: QueueJob[] | null,
  subjects: SubjectsTree | null,
  cohorts: Cohorts,
  selectedSubject: string,
  selectedCohort: string,
}

const defaultContext = {
  cohorts: null,
  subjects: null,
  ongoingRuns: null,
  selectedSubject: null,
  selectedCohort: null,
}

export const context = React.createContext(defaultContext);


