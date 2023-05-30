import { Typography, Divider } from 'antd';
import React from 'react';
import CohortCard from './components/CohortCard/CohortCard';
import SubjectCard from './components/SubjectCard/SubjectCard';
import UploadDataCard from './components/UploadDataCard/UploadDataCard';
import { contentContainer } from '../../util/styles';

const { Title } = Typography;

const YourDataPage: React.FC = () => {
  return (
    <div style={{ 
      // width: 'min-content'
      maxWidth: 1110
      }}>
      <div style={{ textAlign: 'center'}}>
          <Title style={{ marginTop: 0 }} level={1}>Your Data</Title>
        </div>
        <Divider />
      <div style={contentContainer}>
        <div style={{ minWidth: '550px', maxWidth: "550px" }}>
          <CohortCard />
        </div>
        <div style={{ minWidth: '550px', maxWidth: "550px" }}>
          <SubjectCard />
        </div>
        <div style={{ minWidth: '550px', maxWidth: '550px'  }}>
          <UploadDataCard />
        </div>
      </div>
    </div>
  )
}

export default YourDataPage;