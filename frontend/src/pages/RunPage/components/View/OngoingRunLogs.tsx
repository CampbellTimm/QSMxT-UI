import React from 'react';
import { Drawer } from "antd"
import io from 'socket.io-client';

interface Props {
  openOngoingLog: boolean,
  setOpenOngoingLog: any
}

const OngoingRunLogs = (props: Props) => {
  const { openOngoingLog, setOpenOngoingLog } = props;

  const renderBody = () => {
    console.log('render');

    const socket = io('http://localhost:4000/inProgress');
    socket.on('connect', () => {
      console.log('Connected to socket');
    });
    
    socket.on('data', (data) => {
      console.log('Received in progress logs:', data);
    });


    return <div>
      Body
    </div>
  }

  return (
    <Drawer 
    title="Basic Drawer" 
    placement="right" 
    onClose={() => setOpenOngoingLog(false)} 
    open={openOngoingLog}
  >
    {openOngoingLog ? renderBody() : <div />}
  </Drawer>
  )
}

export default OngoingRunLogs;