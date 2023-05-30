import React from 'react';
import ViewRuns from './components/View/ViewRuns';
import RunStarter from './components/Run/RunStarter';
import { Divider, Typography } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

const RunPage = () => {
  return (
    <div style={{
      //  width: 'min-content', 
    maxWidth: 1100 }}>
      <div style={{ textAlign: 'center'}}>
        <Title style={{ marginTop: 0 }}  level={1}>Run</Title>
      </div>
      <Divider />
      {/* <div style={{ minWidth: '100%', textAlign: 'center' }}>
      <Text >
        This page is used to 
      </Text>
      </div> */}
     
      <div style={{ display: 'flex', flexDirection: 'row' }}> 
        <div style={{ width: 500, marginRight: 50 }}> 
        <RunStarter />

        </div>
        <div style={{ width: 370}}>
          <ViewRuns   />

        </div>
      </div>
   </div>
   
  )
}

export default RunPage;