import React from 'react';
import ViewRuns from './View/ViewRuns';
import RunStarter from './Run/RunStarter';

const RunPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}> 
      <div style={{ width: 370, marginRight: 100 }}> 
        <ViewRuns   />
      </div>
      <div style={{ width: 600}}>
        <RunStarter />
      </div>
    </div>
  )
}

export default RunPage;