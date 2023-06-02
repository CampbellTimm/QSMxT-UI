import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Spin, message } from "antd"
import io from 'socket.io-client';
import { API_URL } from '../../../core/constants';

interface Props {
  openOngoingLog: boolean,
  setOpenOngoingLog: any
}

const OngoingRunLogs = (props: Props) => {
  const { openOngoingLog, setOpenOngoingLog } = props;

  const [socket, setSocket]: [any, any] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const endRef = useRef(null)

  useEffect(() => {
    const socket = io(`${API_URL}/inProgress`);
    socket.on('connect', () => {
      console.log('Connected to socket');
      setSocket(socket as any);
      socket.on('data', (data) => {
        setData(data);
        // if (data.includes('Finished')) {
          // message.success('Finished current run')
          // setLoading(false);
          // setOpenOngoingLog(false);
        // }
  
        // setData((data || '').replace(/\\n/g, "<br />"));
      });

    });
    return () => {
      console.log('socket');
      if (socket) {
        console.log('Disconnecting')
        socket.disconnect();
      }
    }
  }, [])

  useEffect(() => {
    // @ts-ignore
    endRef.current?.scrollIntoView();
  }, [data]);

  const renderBody = () => {
    
    return <div>
      
      {(data || '').split('\n').map(x => {
        return <div>
          {x}
          <br />
          </div>;
      })}
      <br />
      {loading && <Spin size="large" />}
    </div>
  }

  return (
    <Drawer 
      title="Run Logs" 
      size="large"
      placement="right" 
      onClose={() => {
        setOpenOngoingLog(false)
      }} 
      open={openOngoingLog}
    >
      {openOngoingLog ? renderBody() : <div />}
      <div ref={endRef} />
    </Drawer>
  )
}

export default OngoingRunLogs;