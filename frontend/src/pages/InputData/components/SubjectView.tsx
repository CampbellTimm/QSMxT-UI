import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions, Select, UploadProps, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { SubjectsTree } from '../../../util/types';
import { Niivue } from '@niivue/niivue'

const { Panel } = Collapse;

interface Props {
  selectedSubject: string,
  subjects: SubjectsTree,
}

export default ({selectedSubject, subjects}: Props) => {

  if (!subjects) {
    return <div />
  }

  const renderRunDetail = () => {
    const keys = selectedSubject.split("&");
    if (keys.length === 3) {
      const subject = keys[0];
      const session = keys[1];
      const run = keys[2];
      const magnitudeMetadata = subjects[subject].sessions[session].runs[run].echos['01'].magnitude; // TOOD - Add other echos
      const phaseMetadata = subjects[subject].sessions[session].runs[run].echos['01'].phase;
      const magnitudeUrl = `http://127.0.0.1:4000/qsmxt/bids/${subject}/ses-1/anat/${subject}_${session}_run-${run}_echo-01_part-mag_MEGRE.nii`;
      const phaseUrl = `http://127.0.0.1:4000/qsmxt/bids/${subject}/ses-1/anat/${subject}_${session}_run-${run}_echo-01_part-mag_MEGRE.nii`;
      return (
        <div style={{ maxHeight: 400, overflowX: 'auto', overflowY: 'auto' }}>
          Session: {session}
          <br />
          Run: {run}
          <br />
          <Collapse style={{ width: '100% '}}>
            <Panel header="Magnitude Data" key="1" style={{ width: '100% '}}>
              <Descriptions size='small' title="Magnitude" bordered layout="vertical">
                {Object.keys(magnitudeMetadata).map(key => {
                  return (
                    <Descriptions.Item label={<b>{key}</b>}>{magnitudeMetadata[key]}</Descriptions.Item>
                  )
                })}
              </Descriptions>
            </Panel>
            {/* <Panel header="Magnitude Image" key={'2'}>
              <Niivue imageUrl={magnitudeUrl} />
            </Panel> */}
            {phaseMetadata && 
              <Panel header="Phase Data" key="3">
                <Descriptions size='small' title="Phase" bordered layout="vertical">
                  {Object.keys(phaseMetadata).map(key => {
                    return (
                      <Descriptions.Item label={<b>{key}</b>}>{phaseMetadata[key]}</Descriptions.Item>
                    )
                  })}
                </Descriptions>
              </Panel>
            }
            {/* <Panel header="Phase Image" key={'4'}>
              <Niivue imageUrl={phaseUrl} />
            </Panel> */}
          </Collapse>
          <br />
        </div>
      )

    } else {
      return <div>Select a run to view details</div>
    }
  }

  const renderSubjectDetail = (): JSX.Element => {
    const keys = selectedSubject && selectedSubject.split("&");
    return !!selectedSubject
      ? <div>
          Selected Subject <i>{keys[0]}</i>
          <br />
          <br />
          {renderRunDetail()}
        </div>
    : <div>Select a Subject to view their details</div>
  }

  return (
    <div>
      <h1>Subject View</h1>
      {renderSubjectDetail()}
    </div>
  )
}