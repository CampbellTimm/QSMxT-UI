import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions, Typography, Divider, Card, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue from '../../components/NiiVue/NiiVue';
import { getQsmResults } from '../../util/apiClient';
import { API_URL } from '../../core/constants';
import { context } from '../../util/context';
// @ts-ignore
import run1 from './run1.json';
// @ts-ignore
import run2 from './run2.json';
import moment from "moment";

const { Panel } = Collapse;
const { Title } = Typography;

const styles = {
  flexBoxRow: {
    display: 'flex', flexDirection: 'column' as 'column', width: '100%', gap: 10, maxWidth: `1110`, flexWrap: 'wrap' as 'wrap',
    borderLeft: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0', paddingLeft: 15, paddingRight: 15
  }
}

const Results = () => {
  const [qsmResults, setQsmResults]: [any, any] = useState([]);
  // const [activeTab, setQsmResults]: [any, any] = useState([]);
  const { selectedSubjects, selectedCohorts, navigate, cohorts } = React.useContext(context);


  useEffect(() => {
    const fetchQSM = async () => {
      const qsmResults = await getQsmResults()
      setQsmResults(qsmResults)
    }
    fetchQSM()
  }, [])

  const allSelectedSubjects = selectedSubjects.map(x => x.split('&')[0]);
  selectedCohorts.forEach(cohortName => {
    allSelectedSubjects.push(...(cohorts || {})[cohortName].subjects)
  })


  const renderQsmResults = (qsmResult: any) => {
    const subs: any = Object.keys(qsmResult.analysisResults).filter(subject => allSelectedSubjects.find(x => x === subject));

    return (
      <Collapse defaultActiveKey={[]}>
        { qsmResult.qsmImages.filter((image: string) => subs.find((sub: string) => image.includes(sub))).map((image: any) => {
          console.log(image);
          const subject = image.split('/')[image.split('/').length - 1].split('_')[0]
          const session = image.split('ses-')[1].split('_')[0];
          const run = image.split('run-')[1].split('_')[0];

          return (
            <Panel header={<div>Subject: <i>{subject}</i>, Session: <i>{session}</i>, Run: <i>{run}</i></div>} key={image}>
              <br />
              <br />
              <br />
              {image}
              <NiiVue 
                imageUrl={image}
              />
            </Panel>
            
          )
        })}
      </Collapse>
    )
  }


  const renderAnlysisTable = (qsmResult: any) => {
  
    const subs = Object.keys(qsmResult.analysisResults).filter(subject => allSelectedSubjects.find(x => x === subject));
    console.log(subs);

    const panels: any = [];

    subs.forEach(subject => {
      Object.keys(qsmResult.analysisResults[subject].sessions).forEach(session =>{
        Object.keys(qsmResult.analysisResults[subject].sessions[session].runs).forEach(run => {
          // tableData[`Subject: ${subject}, Session: ${session}, Run: ${run}`] = 


          panels.push(
        <Panel header={<div>Subject: <i>{subject}</i>, Session: <i>{session}</i>, Run: <i>{run}</i></div>} key={subject + session + run}>
          <Table
            size="small"
            dataSource={
              qsmResult.analysisResults[subject].sessions[session].runs[run]
              .filter((column: any) => Object.keys(column).length > 1)
              .sort((a: any, b: any) => a.roi.toLowerCase() - b.roi.toLowerCase())
            }
            columns={['roi',	'num_voxels',	'min',	'max',	'median',	'mean',	'std'].map(x => (
              { title: x,
                dataIndex: x, 
                key: x,
                render: (y: any, z, x) => {
                  console.log(z);
                  console.log(x);
                  // @ts-ignore
                  if (z.roi === y) {
                    return y;
                  } else {
                    return y.toString().slice(0, 6)

                  }
                }
              }
              ))}
          />
      
        </Panel>
          )
          
        })
      })
    });
          
          
      // qsmResult.analysisResults[subject].sessions[session].runs[run];

            
      // {Object.keys(tableData).forEach((name: string) => {
      //   return 
      // })}


 

    return (
      <div>
        <Descriptions title={null} bordered>
          <Descriptions.Item label="Run Description">{qsmResult.description}</Descriptions.Item>
          <Descriptions.Item label="Started At">{moment(qsmResult.startedAt).format('MMMM Do YYYY, h:mm:ss a')}</Descriptions.Item>
          <Descriptions.Item label="Finished At">{moment(qsmResult.finishedAt).format('MMMM Do YYYY, h:mm:ss a')}</Descriptions.Item>
          <Descriptions.Item label="Duration">{moment(qsmResult.finishedAt).diff(moment(qsmResult.startedAt), 'minute')} minutes</Descriptions.Item>
          <Descriptions.Item label="Sessions Included">{qsmResult.parameters.sessions.length || 'All'}</Descriptions.Item>
          <Descriptions.Item label="Runs Included">{qsmResult.parameters.runs.length || 'All'}</Descriptions.Item>
          <Descriptions.Item label="QSM Config">{qsmResult.parameters.pipelineConfig}</Descriptions.Item>

        </Descriptions>
        <br />
        <br />
        <Title style={{ marginTop: 0 }} level={5}>Analysis</Title>
        <Collapse defaultActiveKey={[]}>
          {panels}
        </Collapse>
   
      </div>
    )
    
  }


  const renderCards = (qsmResult: any) => {
    let content1: any = '';
    let content2: any = '';
    if (!selectedSubjects.length && !selectedCohorts.length) {
      content1 = <i>Select subjects or cohorts on the left of the scren to view their QSM images </i>;
      content2 = <i>Select subjects or cohorts on the left of the scren to view their analysis results </i>;
    } else if (!qsmResult) {
      content1 = <i>bad </i>;
      content2 = <i>bad</i>;
    
    } else {
      content1 = renderQsmResults(qsmResult);
      content2 = renderAnlysisTable(qsmResult)
    }

    return <div style={styles.flexBoxRow}>
      <Card style={{ minWidth: 600 }} title={<Title level={3}>Analysis Results</Title>}>
        {content2}
      </Card>
      <Card style={{ minWidth: 600 }} title={<Title level={3}>QSM Images</Title>}>
        {content1}
      </Card>
    </div>

  }

  const linkedQsmJobs = qsmResults.filter((qsmResult: any) => {
    return qsmResult.parameters.subjects.find((subject: string) => {
      const a = selectedCohorts.filter(cohortName => (cohorts || {})[cohortName].subjects.find(x => x === subject )).length;
      const b = (selectedSubjects.map(x => x.split('&')[0])).find(x => x === subject);
      console.log(a);
      console.log(b);
      return a || b;
    })
       
  });

  console.log(linkedQsmJobs)


  const tabItems = linkedQsmJobs.length
    ? linkedQsmJobs.map((result: any) => ({ label: result.description, key: result.id, children: renderCards(result) }))
    : [{ label: 'No results selected', key: 'empty', children: renderCards(null) }]


  return (
    <div style={{ width: '100%', maxWidth: 1100 }}>
      <div style={{ textAlign: 'center'}}>
        <Title style={{ marginTop: 0 }}  level={1}>Results</Title>
      </div>
      <Divider />
      <Tabs
        type="card"
        items={tabItems}
      />
    </div>
  
  )
}
export default Results;
