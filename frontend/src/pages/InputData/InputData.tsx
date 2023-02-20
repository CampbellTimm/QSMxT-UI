import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions, Select, UploadProps, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import NiiVue
 from '../../components/NiiVue/NiiVue';
import { InboxOutlined } from '@ant-design/icons';
import CohortView from './components/CohortView';
import { Cohorts, Subjects } from '../../util/types';
import SubjectView from './components/SubjectView';
import JSZip from "jszip";

const { Panel } = Collapse;
const axios = require('axios').default;
const { Dragger } = Upload;

const { Option } = Select;


interface Props {
  selectedSubject: string,
  selectedCohort: string,
  cohorts: Cohorts,
  subjects: Subjects,
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
    console.log(event);
          // @ts-ignore
    console.log(inputRef?.current?.files);
    // await new Promise(resolve => setTimeout(resolve, 1000));

    const zip = new JSZip();

      // @ts-ignore
    Array.from(inputRef?.current?.files).forEach((file: any) => {
      console.log(file);
      zip.file(file.webkitRelativePath, file);
    })

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


  return <div>
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: 450 }}>
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
    <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>

    <input
        ref={inputRef}
        onChange={handleFileReader}   
        type="file"
        multiple={true}
        // @ts-ignore
        webkitdirectory="true" 
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
    </div>
  </div>


  // let displayData: JSX.Element = <div />;
  // if (cohorts && Object.keys(cohorts).length) {

  //   displayData = <Collapse defaultActiveKey={[]}>
  //     {Object.keys(cohorts).map(id => {

  //       return (
  //         <Panel header={id} key={id}>
  //             <Collapse defaultActiveKey={[]}>
  //               {cohorts[id].map(section => {
  //                   return <Panel header={section.section} key={section.id + section.section}>
  //                     <Collapse defaultActiveKey={[]}>
  //                      <Panel header="Metadata" key={section.id + section.section + 'metadata'}>
  //                         <Descriptions title="Metadata" bordered layout="vertical">
  //                           {
  //                             Object.keys(section.metadata).map(key => {
  //                               return (
  //                                 <Descriptions.Item label={<b>{key}</b>}>{section.metadata[key]}</Descriptions.Item>
  //                               )
  //                             })
  //                           }
  //                         </Descriptions>
  //                       </Panel>
  //                       <Panel header="Image" key={section.id + section.section + 'image'}>
  //                         <NiiVue imageUrl={`http://127.0.0.1:4000/qsmxt/bids/${section.id}/ses-1/anat/${section.id}_ses-1_run-1_${section.section}.nii`} />
  //                       </Panel>
  //                     </Collapse>
  //                   </Panel>
  //               })}
  //             </Collapse>

  //         </Panel>
  //       )
  //     })}
  //   </Collapse>
  // }


  // return (
  //   <div>
  //     {/* <b>Your Data</b>
  //     <br />
  //     <br />
  //     {displayData}
  //     <br />
  //     <br />

  //     <b>Upload Data</b>
  //     <br />
  //     <br />
  //     <Upload action="http://localhost:4000/upload" name="uploadFiles" directory>
  //       <Button icon={<UploadOutlined />}>Upload DICOM Directory</Button>
  //     </Upload> */}


  //     <div>

  //     </div>


  //   </div>
  // )
}