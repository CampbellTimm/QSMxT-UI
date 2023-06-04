import { QuestionCircleOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions, Select, UploadProps, message, Card, Typography, Popover, Divider, Row, Col, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import { context } from '../../../util/context';
import { Subject, SubjectsTree } from '../../../types';
import SubjectDetailDrawer from './SubjectDetailDrawer';
import apiClient from '../../../util/apiClient';
import ContentCard from '../../../containers/ContentCard';

const { Title, Paragraph, Text } = Typography;

const subjectHelperText = <Text>
  Data for running the QSMxT pipeline on is stored in the form of subjects.<br />
  A subject refers to a patient or research subject from which the QSM data<br/>
  was sourced.
</Text>

const explanatoryText = <Text> 
  <i>Select a Subject on the left of the screen to view images and details of the magnitude and phase data...</i>
  <Divider />
</Text>

const width = 530;

const SubjectCard: React.FC = () => {
  const { selectedSubjects, subjects, navigate, setSelectedCohorts, setSelectedSubjects, fetchSubjectData } = React.useContext(context);

  const [openDrawer, setOpenDrawer]: [any, any] = useState(false);

  const deleteSubject = (selectedSubject: string) => async () => {
    const deleted = await apiClient.deleteSubject(selectedSubject);
    if (deleted) {
      setSelectedSubjects([]);
      await fetchSubjectData()
    }
  }

  const navigateToSubjectResults = (selectedSubject: string) =>  () => {
    setSelectedCohorts([]);
    setSelectedSubjects([selectedSubject]);
    navigate('/results');
  }

  const renderSubjectDetail = (subjects: Subject[], selectedSubject: string): JSX.Element => {
    const keys = selectedSubject.split("&");
    const subjectName: string = keys[0];
    const session: string = keys[1];
    const run: string = keys[2];
    const subject = subjects.find(sub => sub.subject === subjectName) as Subject;
    const openRunDetailButtonDisabled = keys.length !== 3;
    const openRunButton = (
      <Button 
        onClick={() => setOpenDrawer(true)}
        disabled={openRunDetailButtonDisabled} 
        type="primary"
        style={{ width: '480px' }}
      >
        View Run Images and Associated Data
      </Button>
    )
    const firstSessionName = Object.keys(subject.dataTree.sessions)[0];
    const numOfSessions = Object.keys(subject.dataTree.sessions).length;
    const firstRunName = Object.keys(subject.dataTree.sessions[firstSessionName].runs)[0];
    const numberOfRuns = Object.keys(subject.dataTree.sessions[firstSessionName].runs).length;
    const numberOfEchos = Object.keys(subject.dataTree.sessions[firstSessionName].runs[firstRunName].echos).length;
    return (
      <div style={{ minWidth: '100%', maxWidth: '100%' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3}}>
          <Title  style={{ marginTop: 0 }} level={5}>Subject Details</Title>
          <div>
            <Button type="link" onClick={navigateToSubjectResults(selectedSubject)}>
              View Results
            </Button>
            <Popconfirm
              title={`Delete ${subjectName}?`}
              description={<div>This will also delete all assoicated QSM results</div>}
              onConfirm={deleteSubject(subjectName)}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No" 
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </div>     
        </div>
        <Row>
          <Col span={10}>Selected Subject:</Col>
          <Col>{subjectName}</Col>
        </Row>
        <Row>
          <Col span={10}>Number of Subject Sessions:</Col>
          <Col>{numOfSessions}</Col>
        </Row>
        <Row>
          <Col span={10}>Number of Runs per Session:</Col>
          <Col>{numberOfRuns}</Col>
        </Row>
        <Row>
          <Col span={10}>Number of Echos per Run:</Col>         
          <Col>{numberOfEchos}</Col>
        </Row>
        <Row>
          <Col span={10}>Upload Type:</Col>
          <Col>{subject.uploadFormat}</Col>
        </Row>
        <br />
        {
          openRunDetailButtonDisabled 
            ? <Popover title={null} content={"Select a run for the subject on the left of the screen in order to be able to open it"}>
                {openRunButton}
             </Popover>
            : openRunButton
        }
        <SubjectDetailDrawer 
          open={openDrawer}
          setOpen={setOpenDrawer}
          subject={subject}
          run={run}
          session={session}
        />
      </div>
    )
  }

  const renderNoSelectedSubjectText = (subjects: Subject[]) => {
    return (
      <div>
        <Paragraph>
          Currently you have data uploaded into <b>QSMxT</b> for {subjects.length} subjects.<br/><br/>
          To add more data, use the <i>Upload Data</i> card on this page.
        </Paragraph>
      </div>
    )
  }

  const loading = !subjects;
  return (
    <ContentCard 
      title={'Subject'} 
      width={width} 
      Icon={UserOutlined} 
      helperText={subjectHelperText} 
      loading={loading}
    >
      {!loading && (
        <div style={{ marginRight: 20}}>
          {explanatoryText}
          {selectedSubjects.length
            ? renderSubjectDetail(subjects as Subject[], selectedSubjects[0])
            : renderNoSelectedSubjectText(subjects as Subject[])
          }
        </div>
      )}
    </ContentCard>
  )
}


export default SubjectCard;