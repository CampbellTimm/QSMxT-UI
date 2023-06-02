import { Collapse, Table, Descriptions, Typography, Divider, Card, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue from '../../components/NiiVue/NiiVue';
import apiClient from '../../util/apiClient';
import { context } from '../../util/context';
import moment from "moment";
import PageContainer from '../../containers/PageContainer';
import globalStyles from '../../util/globalStyles';

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
  const { selectedSubjects, selectedCohorts, navigate, cohorts } = React.useContext(context);

  useEffect(() => {
    const fetchResults = async () => {
      const qsmResults = await apiClient.getQsmResults()
      setQsmResults(qsmResults)
    }
    fetchResults()
  }, [])

  const allSelectedSubjects = selectedSubjects.map(x => x.split('&')[0]);
  selectedCohorts.forEach(cohortName => {
    allSelectedSubjects.push(...(cohorts || {})[cohortName].subjects)
  })

  const renderQsmResults = (qsmResult: any) => {
    const subjects: any = Object.keys(qsmResult.analysisResults).filter(subject => allSelectedSubjects.find(x => x === subject));
    return (
      <Collapse defaultActiveKey={[]}>
        { qsmResult.qsmImages.filter((image: string) => subjects.find((sub: string) => image.includes(sub))).map((image: any) => {
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
    const subjects = Object.keys(qsmResult.analysisResults).filter(subject => allSelectedSubjects.find(x => x === subject));
    const panels: any = [];

    subjects.forEach(subject => {
      Object.keys(qsmResult.analysisResults[subject].sessions).forEach(session =>{
        Object.keys(qsmResult.analysisResults[subject].sessions[session].runs).forEach(run => {
          panels.push(
            <Panel header={<div>Subject: <i>{subject}</i>, Session: <i>{session}</i>, Run: <i>{run}</i></div>} key={subject + session + run}>
              <Table
                size="small"
                dataSource={
                  qsmResult.analysisResults[subject].sessions[session].runs[run]
                  .filter((row: any) => Object.keys(row).length > 2)
                  .sort((a: any, b: any) => a.roi.toLowerCase() - b.roi.toLowerCase())
                }
                columns={['roi',	'num_voxels',	'min',	'max',	'median',	'mean',	'std'].map(columnName => (
                  { title: columnName === 'num_voxels' ? 'No. Voxels' : columnName,
                    dataIndex: columnName, 
                    key: columnName,
                    render: (value: any, row, x) => {
                      // @ts-ignore
                      if (row.roi === value) {
                        return value;
                      } else {
                        return value && value.toString().slice(0, 6);
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
        <Title style={globalStyles.noTopMargin} level={5}>Analysis</Title>
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
      content1 = <i>No results for selected subjects and cohorts</i>;
      content2 = <i>No results for selected subjects and cohorts</i>;
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
      const linkedByCohort = selectedCohorts.filter(cohortName => (cohorts || {})[cohortName].subjects.find(x => x === subject )).length;
      const linkedBySubject = (selectedSubjects.map(x => x.split('&')[0])).find(x => x === subject);
      return linkedByCohort || linkedBySubject;
    })     
  });

  const tabItems = linkedQsmJobs.length
    ? linkedQsmJobs.map((result: any) => ({ label: result.description, key: result.id, children: renderCards(result) }))
    : [{ label: 'No results selected', key: 'empty', children: renderCards(null) }]

  return (
    <PageContainer title={"Resuts"} gap={0}>
      <Tabs
        style={{ minWidth: '100%'}}
        type="card"
        items={tabItems}
      />
    </PageContainer>
  )
}
export default Results;
