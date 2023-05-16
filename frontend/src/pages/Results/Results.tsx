import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions, Typography, Divider } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue from '../../components/NiiVue/NiiVue';
import { getQsmResults } from '../../util/apiClient';
import { API_URL } from '../../core/constants';

const { Panel } = Collapse;
const { Title } = Typography;

const styles = {
  flexBoxRow: {
    display: 'flex', flexDirection: 'row' as 'row', width: '100%', gap: 10, maxWidth: `1110`, flexWrap: 'wrap' as 'wrap'
  }
}


// const getQsmNiftiiUrl = (subject: string, id: string, image: string) => {
//   return `http://127.0.0.1:4000/qsmxt/qsm/${subject}/${id}/qsm_final/_qsmjl_rts0/${image}`
// }

const renderQsmResults = (qsmResults: any) => {
  return (
    <Collapse defaultActiveKey={[]}>
      {qsmResults.map((result: any) => {
        return (
          <Panel header={`QSM Run ID: ${result.id}`} key={result.id}>
              <Collapse defaultActiveKey={[]}>
                {
                  (result.images || []).map((image: any, key: any) => {
                    return (
                      <Panel header={`Run: ${key}`} key={key}>
                        <NiiVue 
                          imageUrl={`${API_URL}/${image}`}
                        />
                      </Panel>
                    )
                  })
                }
                
            </Collapse>
          </Panel>
        )
      })}
    </Collapse>
  )
}


const Results = () => {
  const [qsmResults, setQsmResults]: [any, any] = useState([]);

  useEffect(() => {
    const fetchQSM = async () => {
      const qsmResults = await getQsmResults()
      setQsmResults(qsmResults)
    }
    fetchQSM()
  }, [])

  console.log(qsmResults)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ textAlign: 'center'}}>
          <Title level={1}>Results</Title>
        </div>
        <Divider />
      <div style={styles.flexBoxRow}>
        {qsmResults && renderQsmResults(qsmResults)}
        </div>
      {/* {renderQsmResults(qsmResults)} */}
    </div>
  
  )
}
export default Results;
