import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue
 from '../../components/NiiVue';
const { Panel } = Collapse;
const axios = require('axios').default;


export default () => {

  const [data, setData]: [any, any] = useState(null);

  useEffect(() => {
    // document.title = `You clicked ${count} times`;
    const fetchData = async () => {
        const data = (await axios({
          method: 'get',
          url: 'http://127.0.0.1:4000/bids',
        })).data;
        setData(data);
      }
      fetchData();
    },[]);

  console.log(data);

  let displayData: JSX.Element = <div />;
  if (data && Object.keys(data).length) {

    displayData = <Collapse defaultActiveKey={[]}>
      {Object.keys(data).map(id => {

        return (
          <Panel header={id} key={id}>
              <Collapse defaultActiveKey={[]}>
                {data[id].map(section => {
                    return <Panel header={section.section} key={section.id + section.section}>
                      <Collapse defaultActiveKey={[]}>
                       <Panel header="Metadata" key={section.id + section.section + 'metadata'}>
                          <Descriptions title="Metadata" bordered layout="vertical">
                            {
                              Object.keys(section.metadata).map(key => {
                                return (
                                  <Descriptions.Item label={<b>{key}</b>}>{section.metadata[key]}</Descriptions.Item>
                                )
                              })
                            }
                          </Descriptions>
                        </Panel>
                        <Panel header="Image" key={section.id + section.section + 'image'}>
                          <NiiVue imageUrl={`http://127.0.0.1:4000/qsmxt/bids/${section.id}/ses-1/anat/${section.id}_ses-1_run-1_${section.section}.nii`} />
                        </Panel>
                      </Collapse>
                    </Panel>
                })}
              </Collapse>

          </Panel>
        )
      })}
    </Collapse>
  }


  return (
    <div>
      <b>Your Data</b>
      <br />
      <br />
      {displayData}
      <br />
      <br />

      <b>Upload Data</b>
      <br />
      <br />
      <Upload action="http://localhost:4000/upload" name="uploadFiles" directory>
        <Button icon={<UploadOutlined />}>Upload DICOM Directory</Button>
      </Upload>




    </div>
  )
}