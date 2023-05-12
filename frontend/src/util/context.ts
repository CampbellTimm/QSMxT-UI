import React from 'react';
import { Cohorts, QueueJob, SubjectsTree } from '../core/types';

export interface SiteContext {
  subjects: SubjectsTree | null,
  cohorts: Cohorts | null,
  ongoingRuns: QueueJob[] | null,

  selectedSubject: string | null,
  selectedCohort: string,

  setSelectedCohort: (cohort: string | null) => void,
  setSelectedSubject: (subject: string | null) => void,

  fetchSubjectData: () => Promise<void>
  fetchCohortData: () => Promise<void>
}

const defaultContext = {
  cohorts: null,
  subjects: null,
  ongoingRuns: null,
  
  selectedSubject: null,
  selectedCohort: null,

  setSelectedCohort: (cohort: string | null) => {},
  setSelectedSubject: (subject: string | null) => {},

  fetchSubjectData: async () => {},
  fetchCohortData: async () => {},
}

export const context = React.createContext(defaultContext);


