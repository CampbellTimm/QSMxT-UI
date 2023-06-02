import React, { useEffect, useState } from 'react';
import { context } from '../../../../../util/context';
import { getHistory } from '../../../../../util/apiClient';
import { Card, Space } from 'antd';
import moment from 'moment';
import { Job, JobStatus } from '../../../../../types';
import { flexBoxRowSpaceBetween } from '../../../../../util/styles';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './styles.css';
import HistoryRunLogs from './HistoryRunLogs';

interface Props {
}
const RunHistory: React.FC<Props> = (props: Props) => {
  const [history, setHistory]: [any, any] = useState(false);
  const {  } = React.useContext(context);
  const [historyLogOpened, setHistoryLogOpened]: [any, any] = useState(null);

  useEffect(() => {
    const get = async () => {
      const x = await getHistory();
      setHistory(x);
    }
    // TODO - remove for notification socket
    get();
    setInterval(() => {
      get();
    }, 1000)
  }, [historyLogOpened])
  
  if (!history) {
    return <div></div>
  }

  if (!history.length) {
    return <div>No runs are in the history</div>
  }

  return (
    <div>
      <Space direction="vertical" size={16}>
      
      {
        (history as Job[]).map(run => {
          if (run.status === JobStatus.FAILED) {
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
                  <div style={flexBoxRowSpaceBetween}>
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
                  <div style={flexBoxRowSpaceBetween}>
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

export default RunHistory;