import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions, Select, UploadProps, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Subjects } from '../../../util/types';

const { Panel } = Collapse;

interface Props {
  selectedSubject: string,
  subjects: Subjects,
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
      const magnitudeMetadata = subjects[subject].sessions[session].runs[run].magnitude;
      const phaseMetadata = subjects[subject].sessions[session].runs[run].phase;
      return (
        <div>
          Session: {keys[1]}
          <br />
          Run: {keys[2]}
          <br />
          <Collapse>
            <Panel header="Magnitude Data" key="1">
              <Descriptions size='small' title="Magnitude" bordered layout="vertical">
                {Object.keys(phaseMetadata).map(key => {
                  return (
                    <Descriptions.Item label={<b>{key}</b>}>{phaseMetadata[key]}</Descriptions.Item>
                  )
                })}
              </Descriptions>
            </Panel>
            <Panel header="Phase Data" key="2">
              <Descriptions size='small' title="Phase" bordered layout="vertical">
              {Object.keys(phaseMetadata).map(key => {
                return (
                  <Descriptions.Item label={<b>{key}</b>}>{phaseMetadata[key]}</Descriptions.Item>
                )
              })}
              </Descriptions>
            </Panel>
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