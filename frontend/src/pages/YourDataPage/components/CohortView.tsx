import { Select, Input, Card, Typography, Divider, Button, Popconfirm, Popover } from 'antd';
import React from 'react';
import {  QuestionCircleOutlined } from '@ant-design/icons';
import { context } from '../../../util/context';
import apiClient from '../../../util/apiClient';

const { Title, Paragraph, Text, Link } = Typography;

const { Search } = Input;

const explanatoryText = () => <Text> 
  <i>Select a Cohort on the lef of the screen to view and update OR create a new Cohort...</i>
  <Divider />
</Text>

const cohortHelperText = () => <Text>
  Cohorts are used to group subjects for the purpose<br />
  of running the QSM pipeline and viewing their results. <br />
  Use the tree on the left of the screen to select cohorts.
</Text>

const CohortView: React.FC = () => {
  const { selectedCohort, subjects, cohorts, setSelectedCohort, fetchCohortData } = React.useContext(context);
  if (!cohorts) return <div />;

  const deleteCohort = (selectedCohort: string) => async () => {
    const deleted = await apiClient.deleteCohort(selectedCohort);
    if (deleted) {
      setSelectedCohort(null);
      await fetchCohortData()
    }
  }
  
  const createCohort = async (cohortName: string) => {
    const created = await apiClient.createCohort(cohortName);
    if (created) {
      await fetchCohortData();
      setSelectedCohort(cohortName);
    }
  }

  const updateCohort = async (cohortName: string) => {
    const subjects = [];
    await apiClient.updateCohort(cohortName, subjects);
    
  }

  
  const subjectTagRender = () => {
  
  }

  const x = (e) => {
    console.log(e);
  }

  const renderSelectedCohortView= (cohorts, selectedCohort: string) => {
    const options = Object.keys(subjects as any).map(subjectName => ({
      label: subjectName,
      value: subjectName,
    }))
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Title style={{ marginTop: 0 }} level={5}>{selectedCohort}</Title>
          <Popconfirm
            title={`Delete ${selectedCohort}?`}
            description={<div>This will also delete all assoicated QSM results</div>}
            onConfirm={deleteCohort(selectedCohort)}
            onCancel={() => {}}
            okText="Yes"
            cancelText="No" 
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
          <Button danger>Delete</Button>
          </Popconfirm>
       
        </div>
        Linked Subjects

        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          value={cohorts[selectedCohort]}
          onChange={x}
          options={options}
        />
        <div>
        <Button>Reset</Button>
        <Button>Save</Button>
        </div>
         
      </>
    )
  }

  const renderNotSelectedCohortView = () => {
    return <>
      <Title level={5}>Create A New Cohort</Title>
      Cohort Name
      <Search
        placeholder="Enter a cohord name..."
        onSearch={createCohort}
        enterButton="Create"
      />
    </>
  }

  if (!subjects && !cohorts) {
    return <div /> // TODO - add loading
  }

  return (
    <Card 
      title={
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <Title style={{ marginTop: 20 }} level={3}>Cohort </Title>
          <Popover title={null} content={cohortHelperText()} >
            <QuestionCircleOutlined style={{ color: '#1677ff', marginTop: 24, marginLeft: 5, fontSize: 15  }} />
          </Popover>
        </div>
      }
      style={{ width: '650px'  }}
      actions={[]}
    > 
      <div style={{ marginRight: 20}}>
        {explanatoryText()}
        {selectedCohort
          ? renderSelectedCohortView(cohorts, selectedCohort)
          : renderNotSelectedCohortView()
        }
      </div>
    </Card>
  )
}

export default CohortView;