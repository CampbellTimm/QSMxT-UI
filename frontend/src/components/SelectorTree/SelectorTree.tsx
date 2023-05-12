import { Button, Card, Tooltip, Typography } from 'antd';
import React from 'react';
import CohortTree from './CohortTree/CohortTree';
import SubjectTree from './SubjectTree/SubjectTree';
import { context } from '../../util/context';
import { PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;

const styles = {
  subjectSelector: { 
    width: '300px',  
    minHeight: '100%', 
  }
}

const YourData = () => {
  return (
    <Card 
      style={{ marginRight: 14, minHeight:'100%' }}
      title={null}>
      <div style={styles.subjectSelector}>
        <div style={{ minHeight: '50%', height: '50%' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Title style={{marginTop: 0}} level={4}>Cohorts</Title>
            <QuestionCircleOutlined style={{ color: '#1677ff' }} />
          </div>
          <CohortTree  />
        </div>
        <div style={{ minHeight: '50%' }}>
        <Title style={{marginTop: 9}} level={4}>Subjects</Title>
          <SubjectTree />
        </div>
      </div>
    </Card>
  )
}

export default YourData;


