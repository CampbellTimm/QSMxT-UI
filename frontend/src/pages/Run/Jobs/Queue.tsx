import React, { useEffect, useState } from 'react';
import { Card, Empty, RadioChangeEvent, Skeleton, Space, Spin, Typography } from 'antd';
import { Radio, Tabs } from 'antd';
import { context } from '../../../util/context';
// @ts-ignore
import { UpOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Job, JobStatus } from '../../../types';
import OngoingRunLogs from './OngoingRunLogs';

const { Title, Paragraph, Text } = Typography;

const styles = {
}

const Queue = () => {
  const { queue } = React.useContext(context);
  const [openOngoingLog, setOpenOngoingLog]: [any, any] = useState(false);
    
  if (!queue) {
    return <Skeleton />
  }

  if (!queue.length) {
    return <div><br/><Empty description="No jobs in your queue" /></div>
  }
    
  const renderOngoingRun = (queue: Job[]) => {
    const runningTask: Job = queue.find(job => job.status === JobStatus.IN_PROGRESS) as Job;
    return (
        <Card 
          size="small" 
          key={runningTask.id}
          title={<div>{runningTask.type} <Spin style={{ marginLeft: 4 }} /></div>} 
          extra={<a href="#" onClick={() => setOpenOngoingLog(true)}>View Logs</a>} 
          style={{ width: 320 }}
          >
          {}
          Started {moment(runningTask.startedAt).fromNow()}
          <br />
          {/* <div style={{ textAlign: 'center' }}>
          Executing
  
          </div> */}
        </Card>
                 
    )
  }

  // console.log(queue);



  const queuedJobs = queue.slice(1);

  return (
    <div style={{ overflowY: 'auto' }}>
      <Space direction="vertical" size={16}>
        {renderOngoingRun(queue)}
        {
          (queuedJobs as Job[]).map(run => {
            return (
              <Card 
                key={run.id}
                size="small" 
                title={run.type} 
                style={{ width: 320 }}
              >
                Waiting in queue...
              </Card>
            )
          })
        }
      </Space>
      {
          openOngoingLog && 
            <OngoingRunLogs
              openOngoingLog={openOngoingLog}
              setOpenOngoingLog={setOpenOngoingLog}
            />
        }     
    </div>
  )
}

export default Queue;