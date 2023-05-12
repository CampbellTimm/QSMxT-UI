import React, { useState } from 'react';
import { Card, RadioChangeEvent, Skeleton, Space, Spin, Typography } from 'antd';
import { Radio, Tabs } from 'antd';
import { QueueJob } from '../../../../util/types';
import { context } from '../../../../util/context';
// @ts-ignore
import { UpOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';
import Queue from './Queue';
import RunHistory from './RunHistory';
import moment from 'moment';

const { Title, Paragraph, Text, Link } = Typography;

const styles = {
  radioButton: { width: 150, textAlign: 'center' as 'center' }
}

const renderOngoingRun = (ongoingRuns: QueueJob[] | null) => {
  if (!ongoingRuns) {
    return <Skeleton />
  }

  if (!(ongoingRuns as QueueJob[]).length) {
    return <div>
      There is no currently no run that is in progress
    </div>
  }

  const runningTask = ongoingRuns[0] as QueueJob;


  return (
    <div>
      {/* <Title style={{ textAlign: 'center'}} level={5}>Running Task:</Title> */}
      <Card 
        size="small" 
        title={<div>{runningTask.description} <Spin style={{ marginLeft: 4 }} /></div>} 
        extra={<a href="#">View Output</a>} 
        style={{ width: 300 }}
        >
        {}
        Started {moment(runningTask.startTime).fromNow()}
        <br />
        {/* <div style={{ textAlign: 'center' }}>
        Executing

        </div> */}
      </Card>
    </div>
  )
}

const ViewRuns = () => {
  const { ongoingRuns } = React.useContext(context);
  const [view, setView]: [string, (view: string) => void] = useState(localStorage.getItem("runView") || 'queue');

  const handleModeChange = (e: RadioChangeEvent) => {
    const view = e.target.value;
    localStorage.setItem("runView", view);
    setView(view);
  };
  


  // const queueDisabled = (ongoingRuns || []).length <= 1;


  return (
    // <div style={{ paddingRight: 50, display: 'flex', flexDirection: 'column'}}>
      // <Title level={2}>View Runs</Title>
      <Card 
        title={<Title level={3}>View Runs</Title>}
        // style={{ minHeight: '100% '}}
      >
      {/* <Card title={<Title level={2}>View Runs</Title>}> */}
      {renderOngoingRun(ongoingRuns)}
      <br />

      <Radio.Group 
        onChange={handleModeChange} 
        value={view} 
        style={{marginBottom: 8 }}
        buttonStyle="solid"  
      >
        <Radio.Button value="queue" disabled={false} style={styles.radioButton}>           
          Queue
        </Radio.Button>
        <Radio.Button value="history" style={styles.radioButton}>
          History
        </Radio.Button>
      </Radio.Group>
      {view === 'queue'
        ? <Queue />
        : <RunHistory />
      }
    </Card>
  )
}

export default ViewRuns;