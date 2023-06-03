import { Collapse, Table, Descriptions, Typography, Divider, Card, Tabs } from 'antd';
import React from 'react';
import NiiVue from '../../components/NiiVue/NiiVue';
import { context } from '../../util/context';
import ContentCard from '../../containers/ContentCard';
import { PictureOutlined } from '@ant-design/icons';
import { QsmResult } from '../../types';

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface Props {
  qsmResult: QsmResult | null,
  allSelectedSubjects: string[],
  loading: boolean
}

const QsmImages: React.FC<Props> = ({ qsmResult, allSelectedSubjects, loading }) => {
  const { selectedSubjects, selectedCohorts, navigate, cohorts } = React.useContext(context);

  const renderQsmResults = (qsmResult: QsmResult) => {
    return (
      <Collapse defaultActiveKey={[]}>
        {qsmResult.qsmImages.filter((image: string) => allSelectedSubjects.find((subject: string) => image.includes(subject))).map((image: string) => {
          const subject = image.split('/')[image.split('/').length - 1].split('_')[0]
          const session = image.split('ses-')[1].split('_')[0];
          const run = image.split('run-')[1].split('_')[0];
          return (
            <Panel header={<div>Subject: <i>{subject}</i>, Session: <i>{session}</i>, Run: <i>{run}</i></div>} key={image}>
              <NiiVue 
                imageUrl={image}
                type='qsm'
              />
            </Panel>
          )
        })}
      </Collapse>
    )
  }

  const renderBody = (qsmResult: QsmResult | null) => {
    if (!selectedSubjects.length && !selectedCohorts.length) {
      return <i>Select subjects or cohorts on the left of the scren to view their QSM images </i>;
    } else if (!qsmResult) {
      return <Text>No results for selected subjects and cohorts</Text>;
    } else if (!qsmResult.qsmFinishedAt) {
      return <Text>QSM pipeline is still processing...</Text>;
    } else {
      return renderQsmResults(qsmResult);
    }
  }

  return (
    <ContentCard 
      title={'QSM Images'} 
      width={'100%'} 
      Icon={PictureOutlined} 
      helperText={"The QSM Nitfi images generated from your QSM pipeline job"} 
      loading={loading}
    >
      {renderBody(qsmResult)}  
    </ContentCard>
  )
}

export default QsmImages;