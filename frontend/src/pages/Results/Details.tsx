import { Collapse, Table, Descriptions, Typography, Divider, Card, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue from '../../components/NiiVue/NiiVue';
import apiClient from '../../util/apiClient';
import { context } from '../../util/context';
import moment from "moment";
import PageContainer from '../../containers/PageContainer';
import globalStyles from '../../util/globalStyles';
import { QsmResult } from '../../types';
import ContentCard from '../../containers/ContentCard';
import { ContainerOutlined, TableOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Title, Text } = Typography;

interface Props {
  qsmResult: QsmResult | null,
  allSelectedSubjects: string[],
  loading: boolean
}

const Details: React.FC<Props> = ({ qsmResult, allSelectedSubjects, loading }) => {
  const { selectedSubjects, selectedCohorts } = React.useContext(context);

  const renderBody = (qsmResult: QsmResult | null) => {
    if (!selectedSubjects.length && !selectedCohorts.length) {
      return <i>Select subjects or cohorts on the left of the scren to view their analysis results </i>;
    } else if (!qsmResult) {
      return <i>No results for selected subjects and cohorts</i>;
    } else {
      const { description, startedAt, qsmFinishedAt, segmentationFinishedAt, segmentationCreatedAt, parameters } = qsmResult;
      return (
        <Descriptions title={null} bordered>
          <Descriptions.Item label="Run Description">{description}</Descriptions.Item>
          <Descriptions.Item label="Started At">
            {startedAt ? moment(startedAt).format('MMMM Do YYYY, h:mm:ss a') : 'Not started yet'}
          </Descriptions.Item>
          <Descriptions.Item label="QSM Finished At">
            {qsmFinishedAt ? moment(qsmFinishedAt).format('MMMM Do YYYY, h:mm:ss a') : 'Not finished'}
          </Descriptions.Item>
          {segmentationCreatedAt && (
            <Descriptions.Item label="Segmentation Finished At">
              {segmentationFinishedAt ? moment(segmentationFinishedAt).format('MMMM Do YYYY, h:mm:ss a') : 'Not finished'}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Sessions Included">{parameters.sessions.length || 'All'}</Descriptions.Item>
          <Descriptions.Item label="Runs Included">{parameters.runs.length || 'All'}</Descriptions.Item>
          <Descriptions.Item label="QSM Config">{parameters.pipelineConfig}</Descriptions.Item>
        </Descriptions> 
      )
    }
  }

  return (
    <ContentCard 
      title={'Run Details'} 
      width={'100%'} 
      Icon={ContainerOutlined} 
      helperText={"Details of the QSM job"} 
      loading={loading}
    >
      {renderBody(qsmResult)}
    </ContentCard>
  )
}

export default Details;