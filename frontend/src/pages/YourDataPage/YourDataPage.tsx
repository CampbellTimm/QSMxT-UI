// @ts-ignore
import { Button, Upload, Collapse, Table, Descriptions, Select, UploadProps, message, Input, Typography, Divider } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import CohortView from './components/CohortView';
import SubjectView from './components/SubjectView';
import { context } from '../../util/context';
import UploadData from './components/UploadData';

const { Search } = Input;

const axios = require('axios').default;

const { Title } = Typography;

const YourDataPage: React.FC = () => {
  const { subjects, selectedSubject } = React.useContext(context);

  const handleFileReader = async (event) => {
    console.log(event.target.files)
    var file = event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      console.log(reader.result);
    };

  }

  const updateInput  = async (path: string) => {
  
  }

  return (
  <div style={{ width: 'min-content'}}>
     <div style={{ textAlign: 'center'}}>
        <Title level={1}>Your Data</Title>
      </div>
      <Divider />
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <CohortView />
      <SubjectView />
    </div>
    <UploadData />
    {/* <br />
    <br />
      <div>
       
      </div>
    <br />
    <br />
    <br />
    <br />
    <input
      onChange={handleFileReader}   
      type="file"
      multiple={true}
      // @ts-ignore
      webkitdirectory="true" 
      mozdirectory ="true" 
      directory  ="true" 
      /> */}
  </div>
  )
}

export default YourDataPage;