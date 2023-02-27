import React, { useEffect, useState } from 'react';
import { Select, InputNumber, message, Button, Tabs, Typography,  Card, Space  } from 'antd';
import { getRuns, runQsmPipeline } from '../../util/apiClient';
import { Cohorts, QueueJob, SubjectsTree } from '../../util/types';
const axios = require('axios').default;
const { Title, Paragraph, Text, Link } = Typography;

const renderOngoingRuns = (ongoingRuns: QueueJob[]) => {
  console.log(ongoingRuns)

  if (!ongoingRuns?.length) {
    return <div>
      No segmentations or QSM pipelines are currently in the queue 
    </div>
  }
  return (
    <Space direction="vertical" size={16}>
      {
        ongoingRuns.map(run => {
          return (
            <Card size="small" title={run.description} extra={<a href="#">More</a>} style={{ width: 300 }}>
              Started At: {run.startTime}
            </Card>
          )
        })
      }
    </Space>
  )
}

interface Props {
  ongoingRuns: QueueJob[],
  subjects: SubjectsTree,
  cohorts: Cohorts
}

const { Option } = Select;
export default ({ ongoingRuns, subjects, cohorts }: Props) => {

  const [params, setParams]: [any, any] = useState({});


  const changeParam = (field: string) => (e: any) => {
    console.log(e);
    setParams({
      ...params,
      [field]: e
    })
  }

  const run = async () => {
    message.success("Running QSM Pipeline")
    await runQsmPipeline(params);
  }

  return (
    <div style={{ display: 'flex', 'flexDirection': 'row'}}> 
      <div style={{ width: '400px', paddingRight: 50 }}>
        <Title level={2}>Ongoing Runs</Title>
        {renderOngoingRuns(ongoingRuns)}
      </div>
      <div style={{ width: 600}}>
        <Title level={2}>Start a Run</Title>


        <Tabs defaultActiveKey="2" centered>
          {/* <Tabs.TabPane tab="Segmentations" key="1">
            <h1>Segmentations</h1>
          </Tabs.TabPane> */}
          <Tabs.TabPane tab="QSM" key="2">
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
              // onChange={() -> {}}
            >
              {(subjects ? Object.keys(subjects) : []).map(x => <Option key={x}>{x}</Option>)}
              
            </Select>
            <br />
            <br />

            <h2>QSM Iterations</h2>
            <InputNumber 
              size="large"
              min={1} 
              max={100000} 
              defaultValue={1000}
            //  onChange={onChange} 
            />
            <br />
            <br />

            <h2>Threshold</h2>
            <InputNumber 
              size="large" 
              min={1} max={100} 
              defaultValue={30}
              //  onChange={onChange} 
            />

            <br />
            <br />

            <Button type="primary" size={"large"} onClick={run}>
              Run
            </Button>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  )
}