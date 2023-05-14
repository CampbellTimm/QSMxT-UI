import React from 'react';
import { Cohorts, Job, Subject, SubjectsTree } from '../core/types';
import { NavigateFunction } from 'react-router-dom';

export interface SiteContext {
  subjects: Subject[] | null,
  cohorts: Cohorts | null,
  queue: Job[] | null,

  selectedSubject: string | null,
  selectedCohort: string,

  setSelectedCohort: (cohort: string | null) => void,
  setSelectedSubject: (subject: string | null) => void,

  fetchSubjectData: () => Promise<void>
  fetchCohortData: () => Promise<void>
  navigate: NavigateFunction
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
  navigate: (path: string) => {}

}

export const context = React.createContext(defaultContext);


