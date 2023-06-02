import React from 'react';
import RunQsm from './RunQSM';
import Jobs from './Jobs';
import PageContainer from '../../containers/PageContainer';

const RunPage: React.FC<{}> = () => {
  return (
    <PageContainer title={"Run"} gap={30}>
      <RunQsm />
      <Jobs />
    </PageContainer>   
  )
}

export default RunPage;