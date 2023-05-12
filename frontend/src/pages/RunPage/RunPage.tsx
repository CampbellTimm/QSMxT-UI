import React from 'react';
import ViewRuns from './components/View/ViewRuns';
import RunStarter from './components/Run/RunStarter';
import { Divider, Typography } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

const RunPage = () => {
  return (
    <div style={{ width: 'min-content'}}>
      <div style={{ textAlign: 'center'}}>
        <Title level={1}>Run</Title>
      </div>
      <Divider />
      <div style={{ display: 'flex', flexDirection: 'row' }}> 
        <div style={{ width: 370, marginRight: 100 }}> 
          <ViewRuns   />
        </div>
        <div style={{ width: 600}}>
          <RunStarter />
        </div>
      </div>
   </div>
   
  )
}

export default RunPage;