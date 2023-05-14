import React, { useState } from 'react';
import { Card, Drawer, RadioChangeEvent, Skeleton, Space, Spin, Typography } from 'antd';
import { Radio, Tabs } from 'antd';
import { context } from '../../../../util/context';
// @ts-ignore
import { UpOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';
import Queue from './Queue';
import RunHistory from './RunHistory';
import moment from 'moment';
import { Job, JobStatus } from '../../../../core/types';
import OngoingRunLogs from './OngoingRunLogs';

const { Title, Paragraph, Text, Link } = Typography;

const styles = {
  radioButton: { width: 150, textAlign: 'center' as 'center' }
}

const ViewRuns = () => {
  const { queue } = React.useContext(context);
  const [view, setView]: [string, (view: string) => void] = useState(localStorage.getItem("runView") || 'queue');
  const [openOngoingLog, setOpenOngoingLog]: [any, any] = useState(false);

  const handleModeChange = (e: RadioChangeEvent) => {
    const view = e.target.value;
    localStorage.setItem("runView", view);
    setView(view);
  };
  
  const renderOngoingRun = (queue: Job[] | null) => {
    if (!queue) {
      return <Skeleton />
    }
    const runningTask = queue.find(job => job.status === JobStatus.IN_PROGRESS);
    if (!runningTask) {
      return <div>
        There is no currently no job that is in progress
      </div>
    }
    return (
      <div>
        {/* <Title style={{ textAlign: 'center'}} level={5}>Running Task:</Title> */}
        <Card 
          size="small" 
          title={<div>{runningTask.type} <Spin style={{ marginLeft: 4 }} /></div>} 
          extra={<a href="#" onClick={() => setOpenOngoingLog(true)}>View Output</a>} 
          style={{ width: 300 }}
          >
          {}
          Started {moment(runningTask.startedAt).fromNow()}
          <br />
          {/* <div style={{ textAlign: 'center' }}>
          Executing
  
          </div> */}
        </Card>
        <OngoingRunLogs
          openOngoingLog={openOngoingLog}
          setOpenOngoingLog={setOpenOngoingLog}
        />
      </div>
    )
  }

  return (
      <Card 
        title={<Title level={3}>Job Queue</Title>}
        // style={{ minHeight: '100% '}}
      >
      {renderOngoingRun(queue)}
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