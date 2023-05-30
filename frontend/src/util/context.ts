import React from 'react';
import { Cohorts, Job, Subject, SubjectsTree } from '../types';
import { NavigateFunction } from 'react-router-dom';

export enum Page {
  Home = 'home',
  YourData = 'yourData',
  Run = 'run',
  Results = 'results'
}

export interface SiteContext {
  page: Page,

  subjects: Subject[] | null,
  cohorts: Cohorts | null,
  queue: Job[] | null,

  selectedSubjects: string[],
  selectedCohorts: string[],

  setSelectedCohorts: (cohorts: string[]) => void,
  setSelectedSubjects: (subjects: string[]) => void,
  fetchQueueData: () => void,

  fetchSubjectData: () => Promise<void>
  fetchCohortData: () => Promise<void>
  navigate: NavigateFunction
}

const defaultContext: SiteContext = {
  page: Page.Home,

  cohorts: null,
  subjects: null,
  queue: null,
  
  selectedSubjects: [],
  selectedCohorts: [],

  setSelectedCohorts: (cohorts: string[]) => {},
  setSelectedSubjects: (subjects: string[]) => {},

  fetchSubjectData: async () => {},
  fetchCohortData: async () => {},
  navigate: () => {},
  fetchQueueData: () => {},

}

export const context = React.createContext(defaultContext);


