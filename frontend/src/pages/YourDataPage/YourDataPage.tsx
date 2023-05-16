import { Typography, Divider } from 'antd';
import React from 'react';
import CohortCard from './components/CohortCard/CohortCard';
import SubjectCard from './components/SubjectCard/SubjectCard';
import UploadDataCard from './components/UploadDataCard/UploadDataCard';

const { Title } = Typography;

const styles = {
  flexBoxRow: {
    display: 'flex', 
    flexDirection: 'row' as 'row',
    width: '100%', 
    gap: 10, 
    maxWidth: `1110`,
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'center' as 'center'
  }
}

const YourDataPage: React.FC = () => {
  return (
    <div style={{ 
      // width: 'min-content'
      maxWidth: 1110
      }}>
      <div style={{ textAlign: 'center'}}>
          <Title level={1}>Your Data</Title>
        </div>
        <Divider />
      <div style={styles.flexBoxRow}>
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