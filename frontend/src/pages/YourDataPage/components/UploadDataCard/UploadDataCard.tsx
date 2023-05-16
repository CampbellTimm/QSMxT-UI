import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Card, Input, Popover, Radio, Select, Steps, Typography } from 'antd';
import React, { useState } from 'react';
import apiClient from '../../../../util/apiClient';

const { Title, Paragraph, Text, Link } = Typography;

enum SubjectDataType {
  DICOM = 'DICOM',
  BIDS = 'BIDS',
  NIFTI = 'Nifti'
}

const stepItems = [{ title: 'Data Type' }, { title: 'Configure' }, { title: 'Copy' }];

const uploadHelperText = () => <Text>
  Data for subjects can be uploaded in either the<br />
  BIDS or DICOM format. 
</Text>

const patientNamesHelperText = () => <Text>
  Use the DICOM 'PatientName' field rather than 'PatientID' to identify subjects
</Text>

const sessionDatesHelperText = () => <Text>
  Use the 'StudyDate' field rather than an incrementer to identify scanning sessions
</Text>

const checkAllFilesHelperText = () => <Text>
  Ignores the DICOM file extensions .dcm and .IMA and instead reads all files for valid<br/>
  DICOM headers. This is useful if some of your DICOM files have unusual file extensions<br/> 
  or none at all.
</Text>

const t2wHelperText = () => <Text>
  Patterns used to identify series acquired for QSM, which must be T2*-weighted.<br/>
  These patterns will be used to match the 'ProtocolName' field.
</Text>

const t1wHelperText = () => <Text>
  Ignores the DICOM file extensions .dcm and .IMA and instead reads all files for valid<br/>
  DICOM headers. This is useful if some of your DICOM files have unusual file extensions<br/> 
  or none at all.
</Text>

const styles = {
  smallHelpIcon: { color: '#1677ff', marginTop: 2, marginLeft: 5, fontSize: 13  },
  flexBox: { display: 'flex', flexDirection: 'row' as 'row' }
}

const defaultT2ProtocolPatterns = ["*t2starw*", "*qsm*"];
const defaultT1ProtocolPatterns = ["t1w*"];

const optionPrompt = {
  label: 'Type a value to enter...',
  value: 'STUB'
}

// TODO - Make steps clickable
const UploadDataCard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [dataType, setDataType] = useState(SubjectDataType.DICOM);

  const [usePatientNames, setUsePatientNames] = useState(false);
  const [useSessionDates, setUseSessionDates] = useState(false);
  const [checkAllFiles, setCheckAllFiles] = useState(false);
  const [t2starwProtocolPattern, setT2starwProtocol] = useState(defaultT2ProtocolPatterns);
  const [t1wProtocolPattern, setT1wProtocolPattern] = useState(defaultT1ProtocolPatterns);

  const [t2Options, setT2Options]: [any, any] = useState([optionPrompt]);
  const [t1Options, setT1Options]: [any, any]  = useState([optionPrompt]);
  const [uploadPath, setUploadPath]: [string, any]  = useState('');

  const previousStep = () => {
    setStep(step - 1);
  }

  const nextStep = async () => {
    if (step === 3) {
      if (dataType === SubjectDataType.DICOM) {
        await apiClient.copyDicoms(uploadPath, usePatientNames, useSessionDates, checkAllFiles, t2starwProtocolPattern, t1wProtocolPattern)
      }
      // other data types
    } else {
      setStep(step + 1);
    }
  }

  const updateT2ProtocolOptions = (t2starwProtocolPattern: string[], input: string = '') => {
    const defaultOptions = defaultT2ProtocolPatterns
      .filter(pattern => !t2starwProtocolPattern.includes(pattern))
      .map(pattern => ({ label: pattern, value: pattern }));
    if (input) {
      setT2Options([
        ...defaultOptions,
        {
          label: input,
          value: input
        }
      ])
    } else {
      if (defaultOptions.length) {
        setT2Options([optionPrompt, ...defaultOptions]);
      } else {
        setT2Options([optionPrompt]);
      }
    }
  }

  const onChangeT2Protocol = (input: string) => {
    updateT2ProtocolOptions(t2starwProtocolPattern, input)
  }

  const onSelectT2Protocol = (protocol: string) => {
    if (protocol !== 'STUB') {
      const newProtocols = [...t2starwProtocolPattern, protocol];
      setT2starwProtocol(newProtocols);
      updateT2ProtocolOptions(newProtocols);
    }
  }

  const onDeselectT2Protocol = (protocol: string) => {
    const newProtocols = t2starwProtocolPattern
      .filter(t2 => t2 !== protocol);
    setT2starwProtocol(newProtocols);
    updateT2ProtocolOptions(newProtocols);
  }

  const updateT1ProtocolOptions = (t1wProtocolPattern: string[], input: string = '') => {
    const defaultOptions = defaultT1ProtocolPatterns
      .filter(pattern => !t1wProtocolPattern.includes(pattern))
      .map(pattern => ({ label: pattern, value: pattern }));
    if (input) {
      setT1Options([
        ...defaultOptions,
        {
          label: input,
          value: input
        }
      ])
    } else {
      if (defaultOptions.length) {
        setT1Options([optionPrompt, ...defaultOptions]);
      } else {
        setT1Options([optionPrompt]);
      }
    }
  }
  
  const onChangeT1Protocol = (input: string) => {
    updateT1ProtocolOptions(t1wProtocolPattern, input)
  }

  const onSelectT1Protocol = (protocol: string) => {
    if (protocol !== 'STUB') {
      const newProtocols = [...t1wProtocolPattern, protocol];
      setT1wProtocolPattern(newProtocols);
      updateT1ProtocolOptions(newProtocols);
    }
  }

  const onDeselectT1Protocol = (protocol: string) => {
    const newProtocols = t1wProtocolPattern
      .filter(t2 => t2 !== protocol);
      setT1wProtocolPattern(newProtocols);
    updateT1ProtocolOptions(newProtocols);
  }
  
  const renderDataTypeStep = () => {
    return <div>
      <Text>Which type of subject data are you uploading?</Text>
      <br />
      <Radio.Group onChange={(e) => setDataType(e.target.value)} value={dataType}>
        <Radio value={SubjectDataType.DICOM}>DICOM</Radio>
        <Radio value={SubjectDataType.BIDS}>BIDS</Radio>
        <Radio value={SubjectDataType.NIFTI}>Nifti</Radio>
      </Radio.Group>
    </div>
  }

  const renderDicomConfigureStep = () => {
    return <div>
      <div style={styles.flexBox}>
        <Text>Use patient names?</Text>
        <Popover title={null} content={patientNamesHelperText()} >
          <QuestionCircleOutlined style={styles.smallHelpIcon} />
        </Popover>
      </div>
      <Radio.Group onChange={(e) => setUsePatientNames(e.target.value)} value={usePatientNames}>
        <Radio.Button value={true}>True</Radio.Button>
        <Radio.Button value={false}>False</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <div style={styles.flexBox}>
        <Text>Use session dates?</Text>
        <Popover title={null} content={sessionDatesHelperText()} >
          <QuestionCircleOutlined style={styles.smallHelpIcon} />
        </Popover>
      </div>
      <Radio.Group onChange={(e) => setUseSessionDates(e.target.value)} value={useSessionDates}>
        <Radio.Button value={true}>True</Radio.Button>
        <Radio.Button value={false}>False</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <div style={styles.flexBox}>
        <Text>Check all files?</Text>
        <Popover title={null} content={checkAllFilesHelperText()} >
          <QuestionCircleOutlined style={styles.smallHelpIcon} />
        </Popover>
      </div>
      <Radio.Group onChange={(e) => setCheckAllFiles(e.target.value)} value={checkAllFiles}>
        <Radio.Button value={true}>True</Radio.Button>
        <Radio.Button value={false}>False</Radio.Button>
      </Radio.Group>
      <br />
      <br />
      <div style={styles.flexBox}>
        <Text>T2*-Weighted Protocol Pattern?</Text>
        <Popover title={null} content={t2wHelperText()} >
          <QuestionCircleOutlined style={styles.smallHelpIcon} />
        </Popover>
      </div>
      <Select 
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please entere a protocol pattern..."
        value={t2starwProtocolPattern}
        options={t2Options}
        onSearch={onChangeT2Protocol}
        onSelect={onSelectT2Protocol}
        onDeselect={onDeselectT2Protocol}
      />
      <br />
      <br />
      <div style={styles.flexBox}>
        <Text>T1-Weighted Protocol Pattern?</Text>
        <Popover title={null} content={t2wHelperText()} >
          <QuestionCircleOutlined style={styles.smallHelpIcon} />
        </Popover>
      </div>
      <Select 
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder="Please entere a protocol pattern..."
        value={t1wProtocolPattern}
        options={t1Options}
        onSearch={onChangeT1Protocol}
        onSelect={onSelectT1Protocol}
        onDeselect={onDeselectT1Protocol}
      />
    </div>
  }

  const renderBidsConfigureStep = () => {
    return <div>
      TODO
    </div>
  }

  const renderNiftiConfigureStep = () => {
    return <div>
      TODO
    </div>
  }

  const renderConfigureStep = () => {
    if (dataType === SubjectDataType.DICOM) {
      return renderDicomConfigureStep();
    }
    if (dataType === SubjectDataType.BIDS) {
      return renderBidsConfigureStep();
    }
    if (dataType === SubjectDataType.NIFTI) {
      return renderNiftiConfigureStep();
    }
    return <div />
  }
 
  const renderUploadStep = () => {
    return (
      <div>
        Enter a file path to copy files from
        <Input
          placeholder="Enter a path..."
          onChange={(e) => setUploadPath(e.target.value)}
        />
      </div>
    )
  }

  return (
    <Card
      style={{ width: '100%' }}
      title={
        <div style={{ display: 'flex', flexDirection: 'row'}}>
          <Title style={{ marginTop: 20 }} level={3}>Upload Data</Title>
          <Popover title={null} content={uploadHelperText()} >
            <div style={{ marginTop: 15}}>
              <QuestionCircleOutlined style={{ color: '#1677ff', marginLeft: 5, fontSize: 15  }} />
            </div>
          </Popover>
        </div>
      }
    >
      <Steps
        size="small"
        current={step - 1}
        items={stepItems}
      />
      <br />
      {step === 1 && renderDataTypeStep()}
      {step === 2 && renderConfigureStep()}
      {step === 3 && renderUploadStep()}
      <br />
      <Button 
        disabled={step ===1}
        onClick={previousStep}
        style={{ marginRight: 1 }}
      >

        Previous
      </Button>
      <Button 
        type="primary" 
        onClick={nextStep}>
        {step !== 3 ? 'Next' : ' Finish'}
      </Button>
      
     
    </Card>
  )
}

export default UploadDataCard;