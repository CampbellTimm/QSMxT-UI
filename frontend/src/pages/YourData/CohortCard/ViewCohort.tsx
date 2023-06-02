import { Select, Input, Card, Typography, Divider, Button, Popconfirm, Popover, Form, Tag } from 'antd';
import React, { ReactElement, useEffect, useState } from 'react';
import {  QuestionCircleOutlined } from '@ant-design/icons';
import { context } from '../../../util/context';
import apiClient from '../../../util/apiClient';
import { Cohorts, Subject } from '../../../types';

const { Title, Text } = Typography;

interface Props {
  cohorts: Cohorts,
  subjects: Subject[],
  selectedCohort: string
}
  
const ViewCohort: React.FC<Props> = ({ cohorts, subjects, selectedCohort }) => {
  const { selectedCohorts, setSelectedCohorts, setSelectedSubjects, fetchCohortData, navigate } = React.useContext(context);
  const selectedCohortName = selectedCohort.split('&')[0];
  const cohort = cohorts[selectedCohortName];
  const [linkedSubjects, setLinkedSubjects]: [string[], any] = useState([]);

  useEffect(() => {
    setLinkedSubjects(cohort.subjects)
  }, [JSON.stringify(cohort.subjects)])

  const options = subjects.map(({ subject }) => ({
    value: subject,
  }));

  const updateCohort = async () => {
    await apiClient.updateCohort(selectedCohortName, linkedSubjects);
    await fetchCohortData();
  }

  const onRemoveLinkedTag = (subject: string) => () => {
    setLinkedSubjects(linkedSubjects.filter(linkedSubject => linkedSubject !== subject))
  } 

  const onChangeLinkedSubjects = (linkedSubjects: string[]) => {
    setLinkedSubjects(linkedSubjects);
  }

  const tagRender = (e: any) => {
    const color = cohort.subjects.find(subject => subject == e.value)
      ? 'blue'
      : 'cyan';
    return (
      <Tag
        color={color}
        onMouseDown={(e) => { 
          e.stopPropagation(); 
          e.preventDefault();
        }}
        closable={true}
        onClose={onRemoveLinkedTag(e.value)}
        style={{ marginRight: 3 }}
      >
        {e.value}
      </Tag>
    )
  }

  const deleteCohort = (selectedCohortName: string) => async () => {
    const deleted = await apiClient.deleteCohort(selectedCohortName);
    if (deleted) {
      setSelectedCohorts(selectedCohorts.filter(cohort => cohort !== selectedCohortName));
      await fetchCohortData()
    }
  }

  const navigateToCohortResults = () => {
    setSelectedCohorts([selectedCohortName]);
    setSelectedSubjects([]);
    navigate('/results');
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
        <Title style={{ marginTop: 0 }} level={4}>{selectedCohortName}</Title>
        <div>
          <Button type="link" onClick={navigateToCohortResults}>
            View Results
          </Button>
          <Popconfirm
            title={`Delete ${selectedCohortName}?`}
            description={<div>This will also delete all assoicated QSM results</div>}
            onConfirm={deleteCohort(selectedCohortName)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No" 
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        
        </div>     
      </div>
        <Text>
          <i>{cohort.description}</i>
        </Text>
        <br />
        <br />
        <Title style={{ marginTop: 0 }} level={5}>Linked Subjects</Title>
        
        <Select
          mode="multiple"
          allowClear
          tagRender={tagRender}
          style={{ width: '100%', marginBottom: 4 }}
          placeholder="Please select"
          value={linkedSubjects}
          onChange={onChangeLinkedSubjects}
          options={options}
        />
        <div>
        <Button
          onClick={() => setLinkedSubjects(cohort.subjects)}
          style={{ width: '49%' }}
        >
          Reset
        </Button>
        <Button 
          type="primary" 
          onClick={updateCohort}
          style={{ marginLeft: 2, width: '50%' }}
        >
          Save
        </Button>
      </div>
    </>
  )
}

export default ViewCohort;