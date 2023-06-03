import React, { useContext, useEffect, useState } from 'react';
import { context } from '../../../util/context';
import { Card, Empty, Skeleton, Space } from 'antd';
import moment from 'moment';
import { Job, JobStatus } from '../../../types';
import globalStyles from '../../../util/globalStyles';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './styles.css'; // TODO - remove
import HistoryRunLogs from './HistoryRunLogs';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

const History: React.FC<{}> = () => {
  const location = useLocation();

  const { openJob } = queryString.parse(location.search);

  const { history } = useContext(context);
  const [historyLogOpened, setHistoryLogOpened]: [any, any] = useState(openJob || null);

  if (!history) {
    return <Skeleton />
  }

  if (!history.length) {
    return <div><br/><Empty description="No jobs in your history" /></div>
  }

  return (
    <div style={{ minHeight: '100%'}}>
      <Space direction="vertical" size={16}>
      
      {
        (history as Job[]).map(run => {
          if (run.status === JobStatus.FAILED) {
            return (
              <Card 
                style={{ width: '100%' }}
                onClick={() => {
                  // console.log(run.id);
                  setHistoryLogOpened(run.id)
                }}
                className="historyCard"
                size="small" 
                title={
                  <div style={globalStyles.flexBoxRowSpaceBetween}>
                    <div>{run.type}</div>
                    <CloseOutlined style={{ color: "red "}}/>
                  </div>
                } 
                // style={{ width: 300 }}
                actions={[]}
                >
                {run.finishedAt && `Failed ${moment(run.finishedAt).fromNow()}`}
              </Card>
            )
          } else {
            return (
              <Card 
                style={{ width: 300 }}
                onClick={() => {
                  // console.log(run.id);
                  setHistoryLogOpened(run.id)
                }}
                className="historyCard"
                size="small" 
                title={
                  <div style={globalStyles.flexBoxRowSpaceBetween}>
                    <div>{run.type}</div>
                    <CheckOutlined style={{ color: "green "}}/>
                  </div>
                } 
                actions={[]}
                >
                {run.finishedAt && `Finished successfully ${moment(run.finishedAt).fromNow()}`}
              </Card>
            )
          }


          
        })
      }
    </Space>
    {
          historyLogOpened && 
            <HistoryRunLogs
              historyLogOpened={historyLogOpened}
              setHistoryLogOpened={setHistoryLogOpened}
            />
        }
  </div>
  )
}

export default History;