import { Button, Select, Tabs, Typography, message } from 'antd';
import React, { useState } from 'react';
import { runQsmPipeline } from '../../../../util/apiClient';
import { context } from '../../../../util/context';

const { Title, Paragraph, Text, Link } = Typography;
const { Option } = Select;

const qsmTemplates = [
  "default",
  "gre",
  "epi",
  "bet",
  "fast",
  "body",
  "nextqsm"
]

const QsmRunStarter = () => {
  const { cohorts, subjects } = React.useContext(context);
  const [params, setParams]: [any, any] = useState({ premade: 'default' });

  const changeParam = (field: string) => (e: any) => {
    console.log(e);
    setParams({
      ...params,
      [field]: e
    })
  }

  const run = async () => {
    message.success("Running QSM Pipeline");
    await runQsmPipeline(params);
  }
  
  return (
    <div>
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
      <h2>Pipeline Configurations</h2>
      <Select
        // mode="single"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please select"
        // defaultValue={'default'}
        value={params.premade}
        onChange={changeParam('premade')}
      >
        {qsmTemplates.map(name => <Option key={name}>{name}</Option>)}
      </Select>

      <br />
      <br />

      <Button type="primary" size={"large"} onClick={run}>
        Run
      </Button>
    </div>
  )
}

export default QsmRunStarter;