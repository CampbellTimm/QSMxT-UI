import React, { useState } from 'react';
import { Card, RadioChangeEvent, Space, Spin, Typography } from 'antd';
import { Radio, Tabs } from 'antd';
import { context } from '../../../../util/context';
// @ts-ignore
import { UpOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Job } from '../../../../types';

const { Title, Paragraph, Text, Link } = Typography;

const styles = {
}


const Queue = () => {
  const { queue } = React.useContext(context);

  if (!queue) {
    return <div />
  }

  const queuedJobs = (queue as Job[]).slice(1);

  if (!queuedJobs.length) {
    return <div>
      No additional runs are in the queue
    </div>
  }

  return (
    <div style={{ overflowY: 'scroll' }}>

     

    <Space direction="vertical" size={16}>
    
      {
        (queuedJobs as Job[]).map(run => {
          return (
            <Card 
              size="small" 
              title={run.type} 
              style={{ width: 300 }}
              actions={[
                <UpOutlined />,
                <DownOutlined />,
                <DeleteOutlined />
              ]}
              >
              Started At: {run.startedAt}
            </Card>
          )
        })
      }
    </Space>

    </div>
  )
}

export default Queue;