import { Select, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import { Cohorts, Subjects } from '../../../util/types';

interface Props {
  selectedCohort: string,
  cohorts: Cohorts,
  subjects: Subjects,
  setCohorts: any
}
const { Search } = Input;

export default ({selectedCohort, subjects, cohorts, setCohorts}: Props) => {

  const updateInput = (cohortName: string) => {
    console.log(cohortName);
    setCohorts(Object.assign({}, cohorts, {[cohortName]: []}));
  }

  const handleChange = (subjects) => {
    console.log(subjects);
    cohorts[selectedCohort] = subjects;
    setCohorts(Object.assign({}, cohorts));
  }

  console.log(subjects);
  console.log(cohorts);

  if (!subjects && !cohorts) {
    return <div />
  }

  const options = Object.keys(subjects).map(subjectName => ({
    label: subjectName,
    value: subjectName,
  }))

  const cohortsData: JSX.Element = !selectedCohort
    ? <div>
        Select a Cohort to view their details or create new cohord...
        <Search
          placeholder="Enter a cohord name..."
          onSearch={updateInput}
          enterButton="Create"
        />
      </div>
    : <div>
        Linked Subjects
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          value={cohorts[selectedCohort]}
          onChange={handleChange}
          options={options}
        />
      </div>

  return(
    <div style={{ width: '500px', marginLeft: 10  }}>
      <h1>Cohort View</h1>
      <div style={{ marginRight: 20}}>
        {cohortsData}
      </div>
    </div>
  )
}