import React, { useContext, useState } from 'react';
import { Button, Checkbox, Input, Radio, Select, Tag, Typography } from 'antd';
import apiClient from '../../../util/apiClient';
import { context } from '../../../util/context';
import globalStyles from '../../../util/globalStyles';
import { Subject } from '../../../types';
import ContentCard from '../../../containers/ContentCard';
import { PartitionOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const qsmTemplates = [
  "default",
  "gre",
  "epi",
  "bet",
  "fast",
  "body",
  "nextqsm"
];

const helperText = <Text>
  Used to start QSM Pipeline runs on your selected cohorts and subjects.
</Text>


const QsmRunStarter: React.FC<{}> = () => {
  const { subjects, cohorts, selectedSubjects, selectedCohorts } = useContext(context);
  const [createSegmentation, setCreateSegmentation]: [any, any] = useState(false);
  const [useAllSessions, setUseAllSessions]: [any, any] = useState(true);
  const [useAllRuns, setUseAllRuns]: [any, any] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [runs, setRuns] = useState([]);
  const [pipelineConfig, setPipelineConfig] = useState('default');
  const [description, setDescription] = useState('');

  const subjectsFromCohorts: string[] = [];
  selectedCohorts.forEach(cohort => {
    subjectsFromCohorts.push(...((cohorts || {})[cohort] || { subjects: [] }).subjects)
  })
  
  const allSessions: Set<string> = new Set();
  const allRuns: Set<string> = new Set();
  (subjects || []).forEach((subject: Subject) => {
    Object.keys(subject.dataTree.sessions).forEach(session => {
      allSessions.add(session);
      Object.keys(subject.dataTree.sessions[session].runs).forEach(run => {
        allRuns.add(`run-${run}`);
      })
    });
  })

  const runQsm = async () => {
    await apiClient.runQsmPipeline(sessions, runs, pipelineConfig, selectedSubjects, selectedCohorts, createSegmentation, description);
  }

  const renderSubjectTags = () => {
    return <div>
      {subjectsFromCohorts.map(subject => {
        return <Tag color="blue">{subject}</Tag>
      })}
      {selectedSubjects.filter(selectedSubject => !subjectsFromCohorts.find(subject => subject === selectedSubject)).map(subject => {
        return <Tag color="cyan">{subject}</Tag>
      })}
    </div>
  }

  return (
    <ContentCard 
      title={'Run QSM Pipeline'} 
      width={500} 
      Icon={PartitionOutlined} 
      helperText={helperText} 
      loading={false}
    >
      <Title style={globalStyles.noTopMargin} level={5}>Subjects</Title>
      { !subjectsFromCohorts.length && !selectedSubjects.length
          ? <div>
              <i>Select Subjects and Cohorts on the left of the screen to add to the QSM run</i>
              <br />
            </div>
          : renderSubjectTags()
        }
        <br />  
        <Title style={globalStyles.noTopMargin} level={5}>Run Description</Title>
        <Input
          style={{ width: '100%' }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Enter a run description...'
        />
        <br />  
        <br />
        <div style={globalStyles.flexBoxRowSpaceBetween}>
          <div style={{ minWidth: 150}} >
            <Title style={globalStyles.noTopMargin} level={5}>
              Sessions
            </Title>
          </div>
          <Checkbox 
            checked={useAllSessions}
            onChange={(e) => {
              if (e.target.checked) {
                setSessions([]);
              }
              setUseAllSessions(e.target.checked)
            }}
          >
            Use all?
          </Checkbox>
        </div>
        <Select
          disabled={useAllSessions}
          mode='multiple'
          allowClear
          style={{ width: '100%' }}
          placeholder={useAllSessions 
            ? 'Using all sessions' 
            : "Please select the sessions to run..."
          }
          value={sessions}
          onChange={(e) => {setSessions(e)}}
        >
          {Array.from(allSessions).map(sessionName => <Option key={sessionName}>{sessionName}</Option>)}
        </Select>
        <br />
        <br />
        <div style={globalStyles.flexBoxRowSpaceBetween}>
          <div style={{ minWidth: 150}} >
            <Title style={{ marginTop: 0 }} level={5}>
              Runs
            </Title>
          </div>
          <Checkbox 
            checked={useAllRuns}
            onChange={(e) => {
              if (e.target.checked) {
                setRuns([]);
              }
              setUseAllRuns(e.target.checked)
            }}
          >
            Use all?
          </Checkbox>
        </div>
        <Select
          disabled={useAllRuns}
          mode='multiple'
          allowClear
          style={{ width: '100%' }}
          placeholder={useAllRuns 
            ? 'Using all runs' 
            : "Please select the runs to include..."
          }
          value={runs}
          onChange={(runs) => {setRuns(runs)}}
        >
          {Array.from(allRuns).map(runName => <Option key={runName}>{runName}</Option>)}
        </Select>
        <br />
        <br />
        <Title style={{ marginTop: 0 }} level={5}>
          Pipeline Configuration
        </Title>
        <Select
          allowClear
          style={{ width: '100%' }}
          placeholder="Please select"
          value={pipelineConfig}
          onChange={setPipelineConfig}
        >
          {qsmTemplates.map(name => <Option key={name}>{name}</Option>)}
        </Select>
        <br />
        <br />
        <Title style={globalStyles.noTopMargin} level={5}>
          Segment and Analyze?
        </Title>
        <Radio.Group 
          style={{ width: '100%' }} 
          onChange={e => setCreateSegmentation(e.target.value)} 
          value={createSegmentation}
        >
          <Radio.Button value={true}>True</Radio.Button>
          <Radio.Button value={false}>False</Radio.Button>
        </Radio.Group>
        <br />
        <br />
        <Button 
          style={{ width: '100%'}} 
          type="primary" 
          size={"large"} 
          onClick={runQsm}
        >
          Run
        </Button>
    </ContentCard>
  )
}

export default QsmRunStarter;