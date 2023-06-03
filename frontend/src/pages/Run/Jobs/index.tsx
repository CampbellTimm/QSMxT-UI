import React, { useState } from 'react';
import { Card, Drawer, RadioChangeEvent, Skeleton, Space, Spin, Typography } from 'antd';
import { Radio, Tabs } from 'antd';
import { context } from '../../../util/context';
import { UpOutlined, DownOutlined, DeleteOutlined, OrderedListOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Queue from './Queue';
import History from './History';
import moment from 'moment';
import { Job, JobStatus } from '../../../types';
import OngoingRunLogs from './OngoingRunLogs';
import HistoryRunLogs from './HistoryRunLogs';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import ContentCard from '../../../containers/ContentCard';

const { Title, Text } = Typography;

const styles = {
  radioButton: { width: '50%', textAlign: 'center' as 'center' }
}
const helperText = <Text>
  View the logs of ongoing and historical jobs by clicking on them
</Text>

const ViewRuns = () => {
  const location = useLocation();
  const { queue, history } = React.useContext(context);

  const { openView, openJob } = queryString.parse(location.search);

  const openedView = openView === 'history'
    ? openView
    : 'queue'

  const [view, setView]: [string, (view: string) => void] = useState(openedView);

  const handleModeChange = (e: RadioChangeEvent) => {
    const view = e.target.value;
    localStorage.setItem("runView", view);
    setView(view);
  };

  return (
    <ContentCard 
      title={'Jobs'} 
      width={370} 
      height={660}
      Icon={UnorderedListOutlined} 
      helperText={helperText} 
      loading={false}
    >
      <Radio.Group 
        onChange={handleModeChange} 
        value={view} 
        // defaultValue={"queue"}
        style={{marginBottom: 8, width: '100%' }}
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
          : <History />
        }

    </ContentCard>
  )
}

export default ViewRuns;