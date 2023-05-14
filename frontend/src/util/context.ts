import React from 'react';
import { Cohorts, Job, SubjectsTree } from '../core/types';

export interface SiteContext {
  subjects: SubjectsTree | null,
  cohorts: Cohorts | null,
  queue: Job[] | null,

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
  queue: null,
  
  selectedSubject: null,
  selectedCohort: null,

  setSelectedCohort: (cohort: string | null) => {},
  setSelectedSubject: (subject: string | null) => {},

  fetchSubjectData: async () => {},
  fetchCohortData: async () => {},
}

export const context = React.createContext(defaultContext);


