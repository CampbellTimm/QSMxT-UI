import React from 'react';
import CohortCard from './CohortCard';
import SubjectCard from './SubjectCard';
import UploadDataCard from './UploadDataCard';
import PageContainer from '../../containers/PageContainer';

const YourDataPage: React.FC = () => {
  return (
    <PageContainer title={"Your Data"} gap={10}>
      <CohortCard />
      <SubjectCard />
      <UploadDataCard />
    </PageContainer>   
  )
}

export default YourDataPage;