import React, { useEffect, useState } from 'react';
import { Select, InputNumber, message, Button, Tabs, Typography  } from 'antd';
import { runQsmPipeline } from '../../util/apiClient';
const axios = require('axios').default;

const { Title, Paragraph, Text, Link } = Typography;

const renderOngoingRuns = (ongoingRuns: any[]) => {
  if (!ongoingRuns) {
    return <div>
      No segmentations or QSM pipelines are currently in the queue 
    </div>
  }
  return <div>

  </div>
}


const { Option } = Select;
export default () => {

  const [data, setData]: [any, any] = useState(null);
  const [ongoingRuns, setOngoingRuns]: [any, any] = useState(null);

  const [sessions, setSession]: [any, any] = useState([]);

  const params = {};

  return (
    <div style={{ display: 'flex', 'flexDirection': 'row'}}>
      

      <div style={{ width: '400px', paddingRight: 50 }}>
        <Title level={2}>Ongoing Runs</Title>
        {renderOngoingRuns(ongoingRuns)}
      </div>
      <div style={{ width: 600}}>
        <Title level={2}>Start a Run</Title>



      <Tabs defaultActiveKey="2" centered>
        <Tabs.TabPane tab="Segmentations" key="1">
          <h1>Segmentations</h1>
        </Tabs.TabPane>
        <Tabs.TabPane tab="QSM" key="2">
       <h1>Run QSM Pipeline</h1>

        <h2>Cohorts</h2>
        <Select
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        defaultValue={[]}
        // @ts-ignore
        onChange={(e: any) => {
          console.log(e);
          
          setSession(["ses-1"])
          // setSession(sessions.map(x => data[x]))
        }}
        >
        {data && Object.keys(data).map(x => <Option key={x}>{x}</Option>)}
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
          {sessions.map(x => <Option key={x}>{x}</Option>)}
          \
        </Select>
        <br />
        <br />

        <h2>QSM Iterations</h2>
        <InputNumber size="large" min={1} max={100000} defaultValue={1000}
        //  onChange={onChange} 
        />
        <br />
        <br />

        <h2>Threshold</h2>
        <InputNumber size="large" min={1} max={100} defaultValue={30}
        //  onChange={onChange} 
        />

        <br />
        <br />

        <Button type="primary" size={"large"} onClick={(() => {
        setTimeout(async () => {
          message.success("Running QSM Pipeline")
          await runQsmPipeline(params);

        }, 500)
        })}>
        Run
        </Button>
            </Tabs.TabPane>
          </Tabs>
       
        
      </div>

   

    </div>
  )
}