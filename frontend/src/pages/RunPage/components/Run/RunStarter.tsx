import { Button, Card, Select, Tabs, Typography, message } from 'antd';
import React, { useState } from 'react';
import { runQsmPipeline } from '../../../../util/apiClient';
import QsmRunStarter from './QsmRunStarter';
import { Cohorts, SubjectsTree } from '../../../../types';
import { context } from '../../../../util/context';

const { Option } = Select;

const { Title, Paragraph, Text, Link } = Typography;
const { TabPane } = Tabs;

interface Props {
  subjects: SubjectsTree,
  cohorts: Cohorts
}

const RunStarter = () => {
  const { cohorts, subjects } = React.useContext(context);
  const [params, setParams]: [any, any] = useState({ premade: 'default' });
  const { selectedSubjects } = React.useContext(context);

  const changeParam = (field: string) => (e: any) => {
    console.log(e);
    setParams({
      ...params,
      [field]: e
    })
  }

  const run = async () => {
    
  }

  return (
    <Card title={<Title level={3}>Start a QSM Run</Title>}>
      
        {/* <Tabs defaultActiveKey="qsm" centered> */}
          {/* <TabPane tab="QSM" key="qsm"> */}
            <QsmRunStarter />
          {/* </TabPane> */}
          {/* <TabPane tab="Segmentation" key="segmentation">
          <h2>Cohorts</h2>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Select Cohorts"
              onChange={changeParam('cohorts')}
            >
            {cohorts && Object.keys(cohorts).map(x => <Option key={x}>{x}</Option>)}
            </Select>
            <br />
            <br />
            <h2>Subjects</h2>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              defaultValue={[]}
              // value={sessions}
              onChange={changeParam('subjects')}
            >
              {subjects ? (subjects as any).map((x: any) => <Option key={x.subject}>{x.subject}</Option>) : []}
              
            </Select>
            <br />
            <br />
            <Button type="primary" size={"large"} onClick={run}>
              Run
            </Button>
          </TabPane>
        </Tabs> */}
    </Card>
  )
}

export default RunStarter;