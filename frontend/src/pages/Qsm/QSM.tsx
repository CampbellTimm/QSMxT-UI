import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue from '../../components/NiiVue/NiiVue';
import { getQsmResults } from '../../util/apiClient';
const { Panel } = Collapse;
const axios = require('axios').default;

const getQsmNiftiiUrl = (subject, id, image) => {
  return `http://127.0.0.1:4000/qsmxt/qsm/${subject}/${id}/qsm_final/_qsmjl_rts0/${image}`
}

const renderQsmResults = (qsmResults: any) => {
  return (
    <Collapse defaultActiveKey={[]}>
      {Object.keys(qsmResults).map((subject: string) => {
        return (
          <Panel header={subject} key={subject}>
            <Collapse defaultActiveKey={[]}>
              {Object.keys(qsmResults[subject]).map((id: string) => {
                return (
                  <Panel header={id} key={id}>
                    <Collapse defaultActiveKey={[]}>
                      {qsmResults[subject][id].map(image => {
                        return (
                          <Panel header={image} key={image}>
                            <NiiVue 
                              imageUrl={getQsmNiftiiUrl(subject, id, image)}
                            />
                          </Panel>
                        )
                      })}   
                    </Collapse>
                  </Panel>
                )
              })}
            </Collapse>
          </Panel>
          )
      })}
    </Collapse>
  )
}


export default () => {
  const [qsmResults, setQsmResults]: [any, any] = useState({});

  useEffect(() => {
    const fetchQSM = async () => {
      const qsmResults = await getQsmResults()
      setQsmResults(qsmResults)
    }
    fetchQSM()
  }, [])


  return (
    <div>
      <b>QSM Result Niifty</b>
      {renderQsmResults(qsmResults)}
    </div>
  
  )
}