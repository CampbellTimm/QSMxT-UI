import { Select, Input, Card, Typography, Divider, Button, Popconfirm, Popover, Form, Tag } from 'antd';
import React, { ReactElement, useState } from 'react';
import {  QuestionCircleOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { context } from '../../../../util/context';
import apiClient from '../../../../util/apiClient';
import { Cohorts, Subject } from '../../../../types';
import ViewCohort from './ViewCohort';
import CreateCohort from './CreateCohort';

const { Title, Paragraph, Text, Link } = Typography;

const explanatoryText = () => <Text> 
  <i>Select a Cohort on the lef of the screen to view and update OR create a new Cohort...</i>
  <Divider />
</Text>

const cohortHelperText = () => <Text>
  Cohorts are used to group subjects for the purpose<br />
  of running the QSM pipeline and viewing their results. <br />
  Use the tree on the left of the screen to select cohorts.
</Text>

const CohortCard: React.FC = () => {
  const { selectedCohorts, subjects, cohorts, setSelectedCohorts, fetchCohortData } = React.useContext(context);

  if (!subjects || !cohorts) {
    return <div /> // TODO - add loading
  }

  // const [tags, setTags] = useState(cohorts[selectedCohort].);
  // const [cohortDescription, setCohortDescription] = useState('');


  return (
    <Card 
      title={
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} >
          <div style={{ display: 'flex', flexDirection: 'row'}}>
            <Title style={{ marginTop: 20 }} level={3}>Cohort </Title>
            <Popover title={null} content={cohortHelperText()} >
              <div style={{ marginTop: 15}}>
                <QuestionCircleOutlined style={{ color: '#1677ff', marginLeft: 5, fontSize: 15  }} />
              </div>
            </Popover>
          </div>
          <div style={{  marginTop: 20, }}>
            <UsergroupAddOutlined style={{ color: '#1677ff', fontSize: 28 }} />
          </div>
        </div>
      }
      style={{  }}
      actions={[]}
    > 
      <div style={{ marginRight: 20}}>
        {explanatoryText()}
        {selectedCohorts.length 
          ? <ViewCohort 
              cohorts={cohorts}
              subjects={subjects}
              selectedCohort={selectedCohorts[0]}
            />
          : <CreateCohort />
      }
      </div>
    </Card>
  )
}

export default CohortCard;