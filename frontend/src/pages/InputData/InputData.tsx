import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions, Select, UploadProps, message, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import CohortView from './components/CohortView';
import { Cohorts, SubjectsTree } from '../../util/types';
import SubjectView from './components/SubjectView';
import JSZip from "jszip";

const { Search } = Input;

const { Panel } = Collapse;
const axios = require('axios').default;
const { Dragger } = Upload;

const { Option } = Select;

interface Props {
  selectedSubject: string,
  selectedCohort: string,
  cohorts: Cohorts,
  subjects: SubjectsTree,
  setCohorts: any
}

export default ({selectedSubject, selectedCohort, cohorts, subjects, setCohorts}: Props) => {

  const inputRef = useRef(null);

  const addToCohort = async (cohort: string) => {
    await axios({
      method: 'post',
      url: 'http://127.0.0.1:4000/cohorts',
    })
  }

  const handleFileReader = async (event) => {
    console.log(event.target.files)
    var file = event.target.files[0]
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      console.log(reader.result);
      // this.setState({
      //   imgUpload: reader.result
      // })
    };

    return;


    console.log(event);
    console.log(inputRef);
    // @ts-ignore
    console.log(inputRef.current);
    // @ts-ignore
    console.log(inputRef?.current?.files);


    // await new Promise(resolve => setTimeout(resolve, 1000));

    const zip = new JSZip();

      // @ts-ignore
    Array.from(inputRef?.current?.files).forEach((file: any) => {
      console.log(file);
      zip.file(file.webkitRelativePath, file);
    })

    console.log("Finished Zippng")

    const x = await zip.generateAsync({type:"blob"});
    console.log(x);

    const formData = new FormData();
    formData.append("folderzip", x);

    const y = await axios({
      method: "post",
      url: "http://127.0.0.1:4000/dicoms/upload",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(y);

  }

  const updateInput  = async (event) => {
    // console.log(event);
    const y = await axios({
      method: "post",
      url: "http://127.0.0.1:4000/dicoms/copy",
      data: {
        path: event
      },
      headers: { "Content-Type": "multipart/form-data" },
    });

    // console.log(y);
  }

  return <div>
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 480 }}>
      <CohortView 
        selectedCohort={selectedCohort} 
        cohorts={cohorts}
        subjects={subjects}
        setCohorts={setCohorts}
      />
      <SubjectView 
        selectedSubject={selectedSubject} 
        subjects={subjects}
      />
    </div>
    {/* <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}> */}
      <div>
        Dicom Upload Path
        <Search
          placeholder="Enter a cohord name..."
          onSearch={updateInput}
          enterButton="Upload"
        />
      </div>
    <br />
    <br />
    <br />
    <input
        ref={inputRef}
        onChange={handleFileReader}   
        type="file"
        multiple={true}
        // @ts-ignore
        webkitdirectory="true" 
        mozdirectory ="true" 
        directory  ="true" 
        // accept=".zip,.rar,.7zip"
       />
      {/* <Dragger style={{ width: '1200px'}} {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Upload your BIDS or DICOM data</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Uploaded data will appear under the 'Subjects' bar on the left
        </p>
      </Dragger> */}
    {/* </div> */}
  </div>
}