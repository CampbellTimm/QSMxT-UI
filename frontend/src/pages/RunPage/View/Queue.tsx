import React, { useState } from 'react';
import { Card, RadioChangeEvent, Space, Spin, Typography } from 'antd';
import { Radio, Tabs } from 'antd';
import { QueueJob } from '../../../util/types';
import { context } from '../../../util/context';
// @ts-ignore
import { UpOutlined, DownOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Paragraph, Text, Link } = Typography;

const styles = {
}


const Queue = () => {
  const { ongoingRuns } = React.useContext(context);

  if (!ongoingRuns) {
    return <div />
  }

  const queue = (ongoingRuns as QueueJob[]).slice(1);

  if (!queue.length) {
    return <div>
      No additional runs are in the queue
    </div>
  }

  return (
    <div style={{ overflowY: 'scroll' }}>

     

    <Space direction="vertical" size={16}>
    
      {
        (queue as QueueJob[]).map(run => {
          return (
            <Card 
              size="small" 
              title={run.description} 
              style={{ width: 300 }}
              actions={[
                <UpOutlined />,
                <DownOutlined />,
                <DeleteOutlined />
              ]}
              >
              Started At: {run.startTime}
            </Card>
          )
        })
      }
    </Space>

    </div>
  )
}

export default Queue;