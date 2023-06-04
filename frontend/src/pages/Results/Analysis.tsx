import { Collapse, Table, Descriptions, Typography, Divider, Card, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { context } from '../../util/context';
import globalStyles from '../../util/globalStyles';
import { QsmResult } from '../../types';
import ContentCard from '../../containers/ContentCard';
import { TableOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface Props {
  qsmResult: QsmResult | null,
  allSelectedSubjects: string[],
  loading: boolean
}

const Analysis: React.FC<Props> = ({ qsmResult, allSelectedSubjects, loading }) => {
  const { selectedSubjects, selectedCohorts } = React.useContext(context);
  const renderAnlysisTable = (qsmResult: QsmResult) => {
    const subjects = Object.keys(qsmResult.analysisResults)
    .filter(subject => allSelectedSubjects
      .find(selectedSub => selectedSub === subject)
    );
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
                    render: (value: any, row) => {
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
        <Collapse defaultActiveKey={[]}>
          {panels}
        </Collapse>
      </div>
    )
  }

  const renderBody = (qsmResult: QsmResult | null) => {
    if (!selectedSubjects.length && !selectedCohorts.length) {
      return <i>Select subjects or cohorts on the left of the scren to view their analysis results </i>;
    } else if (!qsmResult) {
      return <Text>No results for selected subjects and cohorts</Text>;
    } else if (!qsmResult.segmentationCreatedAt) {
      return <Text>No segmentation and analysis was configured for this job</Text>
    } else if (qsmResult.segmentationCreatedAt && !qsmResult.segmentationFinishedAt) {
      return <Text>Segmentation and analysis is still loading...</Text>
    }
    else {
      return <div>
        {renderAnlysisTable(qsmResult)}
      </div>
    }
  }

  return (
    <ContentCard 
      title={'Anaylsis Results'} 
      width={'100%'} 
      Icon={TableOutlined} 
      helperText={"The analysis results from the combination of your QSM and Segmentation jobs"} 
      loading={loading}
    >
      {renderBody(qsmResult)}  
    </ContentCard>
  )
}

export default Analysis;