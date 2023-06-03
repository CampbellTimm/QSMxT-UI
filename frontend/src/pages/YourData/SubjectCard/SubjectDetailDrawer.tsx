import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions, Select, UploadProps, message, Card, Typography, Popover, Divider, Row, Col, Drawer } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue from '../../../components/NiiVue/NiiVue';
import { context } from '../../../util/context';
import { Subject, SubjectsTree } from '../../../types';
import { API_URL } from '../../../core/constants';
import axios from 'axios';

interface Props {
  subject: Subject,
  run: string,
  session: string,
  open: boolean,
  setOpen: (open: boolean) => void
}

const { Panel } = Collapse;

const { Title, Paragraph, Text } = Typography;

const SubjectDetailDrawer: React.FC<Props> = ({ subject, run, open, setOpen, session }) => {

  const [selectedEcho, setSelectedEcho]: [any, any] = useState('');
  const [imageType, setImageType]: [any, any] = useState('mag');
  const [imageMetadata, setImageMetadata]: [any, any] = useState({});

  useEffect(() => {
    if (open) {
      const echoNumbers = subject.dataTree.sessions[session].runs[run].echos;
      setSelectedEcho(echoNumbers[0]);
    }
  }, [open])

  useEffect(() => {
    const getMetadata = async () => {
      const metadataUrl = `${API_URL}/bids/${subject.subject}/ses-1/anat/${subject.subject}_${session}_run-${run}_echo-${selectedEcho}_part-${imageType}_MEGRE.json`
      const response = await axios.get(metadataUrl);
      setImageMetadata(response.data)
    }
    if (open && selectedEcho) {
      getMetadata();
    }
  }, [open, imageType, selectedEcho])

  const onChangeEcho = (e: any) => {
    setSelectedEcho(e);
  }

  const onChangeImageType = (e: any) => {
    setImageType(e);
  }

  const renderImageAndDescriptions = () => {
    const imageUrl = `${API_URL}/bids/${subject.subject}/ses-1/anat/${subject.subject}_${session}_run-${run}_echo-${selectedEcho}_part-${imageType}_MEGRE.nii`
    
    const columns = [{
      title: 'Field',
      dataIndex: 'field',
      key: 'field'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    }
  ]

  const dataSource = Object.keys(imageMetadata).map(key => ({ field: key, value: imageMetadata[key]}))
    
    return (
      <div>
         <Title style={{ marginTop: 10 }} level={3}>NIfTI Image</Title>
         <div style={{ maxHeight: '680px' }}>
         <NiiVue imageUrl={imageUrl} key={imageUrl} type={imageType}/>

         </div>
         <br />
         <Title style={{ marginTop: 10 }} level={3}>Details</Title>
         <div>

        <Table columns={columns} dataSource={dataSource.sort((a,b ) => {
          if (a.field < b.field) {
            return -1
          } 
          return 1;
        })} size="small" />
         </div>
             
                
      </div>
    )
  }

  const renderBody = () => {
    console.log(subject);

    const echoNumbers = subject.dataTree.sessions[session].runs[run].echos;
    console.log(echoNumbers)

    const echoOptions = echoNumbers.map(echo => (
      {
        label: echo,
        value: echo
      }
    ))

    const imageOptions = [
      {
        label: 'Magnitude',
        value: 'mag'
      },
      {
        label: 'Phase',
        value: 'phase'
      }
    ]

    return (
      <div>
        <Title style={{ marginTop: 10 }} level={3}>Options</Title>
        <Drawer />
        <Title style={{ marginTop: 10 }} level={5}>Select the Echo Number: </Title>
        <Select
          value={selectedEcho}
          style={{ width: '100%' }}
          onChange={onChangeEcho}
          options={echoOptions}
        />
        <br />
        <Title level={5}>Select the Image Type:</Title>
        <Select
          value={imageType}
          style={{ width: '100%' }}
          onChange={onChangeImageType}
          options={imageOptions}
        />
        <br />
        <br />
        {renderImageAndDescriptions()}
      </div>
    )
  }

  return (
    <div>
      <Drawer
        title={open ? `Subject: ${subject.subject} - Run: ${run}` : ''}
        placement="left"
        open={open}
        size="large"
        onClose={() => setOpen(false)}
      >
        {
          open && selectedEcho
            ? renderBody()
            : <div />
        }
      </Drawer>
    </div>
  )
}

export default SubjectDetailDrawer;