import { Collapse, Table, Descriptions, Typography, Divider, Card, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue from '../../components/NiiVue/NiiVue';
import apiClient from '../../util/apiClient';
import { context } from '../../util/context';
import moment from "moment";
import PageContainer from '../../containers/PageContainer';
import globalStyles from '../../util/globalStyles';
import { QsmResult } from '../../types';
import QsmImages from './QsmImages';
import Analysis from './Analysis';
import Details from './Details';

const Results: React.FC<{}> = () => {

  const { selectedSubjects, selectedCohorts, navigate, cohorts, qsmResults } = React.useContext(context);


  const allSelectedSubjects = selectedSubjects.map(subject => subject.split('&')[0]);
  selectedCohorts.forEach(cohortName => {
    allSelectedSubjects.push(...(cohorts || {})[cohortName].subjects)
  })

  const linkedQsmJobs = (qsmResults || []).filter((qsmResult: any) => {
    return qsmResult.parameters.subjects.find((subject: string) => {
      const linkedByCohort = selectedCohorts.filter(cohortName => (cohorts || {})[cohortName].subjects.find(x => x === subject )).length;
      const linkedBySubject = (selectedSubjects.map(x => x.split('&')[0])).find(x => x === subject);
      return linkedByCohort || linkedBySubject;
    })     
  });

  const renderCards = (qsmResult: QsmResult | null) => (
    <div>
      <Details 
        qsmResult={qsmResult} 
        allSelectedSubjects={allSelectedSubjects} 
        loading={!qsmResults}
      />
      <br />
      <QsmImages 
        qsmResult={qsmResult} 
        allSelectedSubjects={allSelectedSubjects} 
        loading={!qsmResults}
      />
      <br />
      <Analysis 
        qsmResult={qsmResult} 
        allSelectedSubjects={allSelectedSubjects} 
        loading={!qsmResults}
      />
    </div>
  )

  const tabItems = linkedQsmJobs.length
    ? linkedQsmJobs.map((result: QsmResult) => (
        { 
          label: result.description, 
          key: result.id, 
          children: renderCards(result)
        }))
    : [
        { 
          label: !qsmResults ? 'Loading...' : (!allSelectedSubjects.length ? 'No subjects selected' : 'No results for selected subjects'), 
          key: 'empty', 
          children: renderCards(null)
        }
      ]

  return (
    <PageContainer title={"Resuts"} gap={0}>
      <Tabs
        style={{ minWidth: '100%'}}
        type="card"
        items={tabItems}
      />
    </PageContainer>
  )
}
export default Results;
