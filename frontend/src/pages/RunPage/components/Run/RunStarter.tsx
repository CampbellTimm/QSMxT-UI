import { Button, Card, Select, Tabs, Typography, message } from 'antd';
import React, { useState } from 'react';
import { runQsmPipeline } from '../../../../util/apiClient';
import QsmRunStarter from './QsmRunStarter';
import { Cohorts, SubjectsTree } from '../../../../types';

const { Title, Paragraph, Text, Link } = Typography;
const { TabPane } = Tabs;

interface Props {
  subjects: SubjectsTree,
  cohorts: Cohorts
}

const RunStarter = () => {
  return (
    <Card title={<Title level={3}>Start a Run</Title>}>
      
        <Tabs defaultActiveKey="qsm" centered>
          <TabPane tab="QSM" key="qsm">
            <QsmRunStarter />
          </TabPane>
          <TabPane tab="Segmentation" key="segmentation">
            
          </TabPane>
        </Tabs>
    </Card>
  )
}

export default RunStarter;