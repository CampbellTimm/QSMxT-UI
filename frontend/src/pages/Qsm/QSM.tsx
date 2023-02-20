import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Collapse, Table, Descriptions } from 'antd';
import React, { useEffect, useState } from 'react';
import NiiVue
from '../../components/NiiVue/NiiVue';
const { Panel } = Collapse;
const axios = require('axios').default;

export default () => {
  return (
    <div>
      <b>QSM Result Niifty</b>
      <Collapse defaultActiveKey={[]}>
        <Panel header="sub-170705-134431-std-1312211075243167001" key="sub-170705-134431-std-1312211075243167001">
            <NiiVue imageUrl={`http://localhost:4000/qsmxt/02_qsm_output/qsm_final/_run_run-1/sub-170705-134431-std-1312211075243167001_ses-1_run-1_part-phase_T2starw_scaled_qsm_000_composite_average.nii`} />
        </Panel>
        <Panel header="sub-170706-160506-std-1312211075243167001" key="sub-170706-160506-std-1312211075243167001">
            <NiiVue imageUrl={`http://localhost:4000/qsmxt/02_qsm_output/qsm_final/_run_run-1/sub-170706-160506-std-1312211075243167001_ses-1_run-1_part-phase_T2starw_scaled_qsm_000_composite_average.nii`} />
        </Panel>
      </Collapse>
    </div>
  
  )
}