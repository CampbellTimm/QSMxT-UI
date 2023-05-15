import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions, Select, UploadProps, message, Card, Typography, Popover, Divider, Row, Col, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue from '../../../../components/NiiVue/NiiVue';
import { context } from '../../../../util/context';
import { Subject, SubjectsTree } from '../../../../core/types';
import SubjectDetailDrawer from './SubjectDetailDrawer';
import apiClient from '../../../../util/apiClient';

const { Panel } = Collapse;

const { Title, Paragraph, Text, Link } = Typography;

const subjectHelperText = () => <Text>
  Data for running the QSMxT pipeline on is stored in the form of subjects.<br />
  A subject refers to a patient or research subject from which the QSM data<br/>
  was sourced.
</Text>

const explanatoryText = () => <Text> 
  <i>Select a Subject on the lef of the screen to view images and details of the magnitude and phase data...</i>
  <Divider />
</Text>


const SubjectCard: React.FC = () => {
  const { selectedSubject, subjects, navigate, setSelectedCohort, setSelectedSubject, fetchSubjectData } = React.useContext(context);

  const [openDrawer, setOpenDrawer]: [any, any] = useState(false);

  if (!subjects) return <div />;


  const deleteSubject = (selectedSubject: string) => async () => {
    const deleted = await apiClient.deleteSubject(selectedSubject);
    if (deleted) {
      setSelectedSubject(null);
      await fetchSubjectData()
    }
  }

  const navigateToSubjectResults = (selectedSubject: string) =>  () => {
    setSelectedCohort(null);
    setSelectedSubject(selectedSubject);
    navigate('/results');
  }

  const renderSubjectDetail = (subjects: Subject[], selectedSubject: string): JSX.Element => {
    const keys = selectedSubject.split("&");
    const subjectName = keys[0];
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
    return (
      <div style={{ width: '100%'}}>
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
          <Col span={10} >
            Selected Subject:
          </Col>
          <Col>
            {subjectName}
          </Col>
        </Row>
        <Row>
          <Col span={10} >
            Number of Subject Sessions:  
          </Col>
          <Col>
            {2}
          </Col>
        </Row>
        <Row>
          <Col span={10} >
            Number of Runs per Session:  
          </Col>
          <Col>
            {2}
          </Col>
        </Row>
        <Row>
          <Col span={10} >
            Number of Echos per Run:  
          </Col>
          <Col>
            {2}
          </Col>
        </Row>
        <Row>
          <Col span={10} >
            Upload Type:  
          </Col>
          <Col>
            DICOM
          </Col>
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
          run={keys[2]}
          session={keys[1]}
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

  return (
    <Card 
      title={
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <Title style={{ marginTop: 20 }} level={3}>Subject </Title>
          <Popover title={null} content={subjectHelperText()} >
            <div style={{ marginTop: 15}}>
              <QuestionCircleOutlined style={{ color: '#1677ff', marginLeft: 5, fontSize: 15  }} />
            </div>
          </Popover>
        </div>
      }
      // style={{ width: '550px'  }}
      actions={[]}
    > 
      <div style={{ marginRight: 20}}>
        {explanatoryText()}
        {selectedSubject
          ? renderSubjectDetail(subjects, selectedSubject)
          : renderNoSelectedSubjectText(subjects)
        }
      </div>
    </Card>
  )
}


export default SubjectCard;